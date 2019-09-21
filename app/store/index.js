import firebase from '~/plugins/firebase'

export const strict = false

export const state = () => ({
    isLoading: false,
    isMenuActive: false,
    user: null
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
    }
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
    async signin({ commit }, { email, password }) {
        try {
            const res = await firebase.auth().signInWithEmailAndPassword(email, password)

            if (!res) throw new Error('認証ユーザーが存在しません。')
            
            commit('setUser', res.user)
        } catch(e) {
            throw e
        }
    },
    async signup({ commit }, { email, password }) {
        try {
            const res = await firebase.auth().createUserWithEmailAndPassword(email, password)

            if (!res) throw new Error('認証ユーザーの登録に失敗しました。')
            
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
    }
}
  
export const getters = {
    isLoading: state => state.isLoading,
    isMenuActive: state => state.isMenuActive,
    user: state => state.user,
    isAuthenticated: state => !!state.user
}