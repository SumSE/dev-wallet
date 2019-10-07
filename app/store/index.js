import firebase from '~/plugins/firebase'
import db from '~/plugins/db'

export const strict = false

export const state = () => ({
    isLoading: false,
    isMenuActive: false,
    user: null,
    userInfo: null,
})

export const mutations = {
    loading(state, payload) {
        state.isLoading = payload
    },
    toggleMenu(state) {
        state.isMenuActive = !state.isMenuActive
    },
    resetMenu(state) {
        state.isMenuActive = false
    },
    setUser(state, payload) {
        state.user = payload
    },
    setUserInfo(state, payload) {
        state.userInfo = payload
    },
}
  
export const actions = {
    loading({ commit }, payload) {
        commit('loading', payload)
    },
    toggleMenu({ commit }) {
        commit('toggleMenu')
    },
    resetMenu({ commit }) {
        commit('resetMenu')
    },
    setUser({ commit }, payload) {
        commit('setUser', payload)
    },
    setUserInfo({ commit }, payload) {
        commit('setUserInfo', payload)
    },
    async signin({ commit }, { email, password }) {
        try {
            const res = await firebase.auth().signInWithEmailAndPassword(email, password)

            if (!res) throw new Error('User is not present.')

            const coinRef = db.collection('xcmg')
            const doc = await coinRef.doc(res.user.uid).get()
            const docData = doc.data()

            commit('setUser', res.user)
            commit('setUserInfo', docData)

        } catch(e) {
            throw e
        }
    },
    async signup({ dispatch, commit }, { email, password, extraInfo }) {
        try {

            const res = await firebase.auth().createUserWithEmailAndPassword(email, password)

            if (!res) throw new Error('An error occured while processing regitration.')

            const coinRef = db.collection('xcmg')

            const data = {
                name: extraInfo.name,
                placeOfResidence: extraInfo.placeOfResidence,
                phone: extraInfo.phone,
                birthday: extraInfo.birthday
            }

            commit('setUserInfo', data)

            await coinRef.doc(res.user.uid).set(data)  

            await res.user.sendEmailVerification({ url: window.location.origin })

            commit('setUser', res.user)

        } catch(e) {
            throw e
        }
    },
    async signout({ commit }) {
        try {
            await firebase.auth().signOut()

            commit('setUser', null)
        } catch(e) {
            throw e
        }
    },
    async updateUserInfo({ commit, state }, userInfo) {
        try {
            userInfo.birthday = firebase.firestore.Timestamp.fromDate(userInfo.birthday)
            await db.collection('xcmg').doc(state.user.uid).update(userInfo)  

            commit('setUserInfo', userInfo)
        } catch(e) {
            throw e
        }
    },
    async resetPassword(_, emailAddress) {
        try {
            await firebase.auth().sendPasswordResetEmail(emailAddress)
        } catch (e) {
            throw e
        }
    },
    async getBalanceUSD(_, balance) {
        try {
            const results = await Promise.all([
                this.$axios.get('/ataix/'),
                this.$axios.get('/bitfinex/')
            ])
            const xcmgToBtc = results[0].data.result[0].ask
            const btcToUsd = results[1].data[7]
            return balance * xcmgToBtc * btcToUsd
        } catch (e) {
            throw e
        }
    }
}
  
export const getters = {
    isLoading: state => state.isLoading,
    isMenuActive: state => state.isMenuActive,
    user: state => state.user,
    userInfo: state => {
        if (!state.userInfo) {
            return null
        }

        const info = { ...state.userInfo }

        // 初期の頃の実装の名残でbirthdayがstring型で入っている場合とtimestamp型で入っている場合があるので分岐する
        if(typeof info.birthday === 'string') {
            // string型で日付が入っている場合はnew Date()でDate型に変換する
            info.birthday = new Date(info.birthday)
        } else {
            // firestoreのtimestamp型の場合はtoDate()を使ってDate型に変換する
            info.birthday = info.birthday.toDate()
        }
        return info
    },
    isAuthenticated: state => !!state.user
}
