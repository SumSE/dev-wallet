import db from '~/plugins/db'

export const state = () => ({
    address: '',
    balance: 0,
    transactions: [],
    books: []
})

export const mutations = {
    setData(state, payload) {
        Object.assign(state, payload)
    },
    addBook(state, payload) {
        state.books.push(payload)
    }
}
  
export const actions = {
    async load({ dispatch, commit, rootGetters }) {
        try {
            const coinRef = await dispatch('collection')
            
            const doc = await coinRef.doc(rootGetters.user.uid).get()

            const snapTran = await coinRef.doc(rootGetters.user.uid).collection('transactions').orderBy('date', 'desc').get()
            const transactions = snapTran.docs.map(d => d.data());

            const snapBook = await coinRef.doc(rootGetters.user.uid).collection('books').get()
            const books = snapBook.docs.map(d => d.data());

            const data = {
                address: doc.exists ? doc.data().address : '',
                balance: doc.exists ? doc.data().balance : 0,
                transactions: transactions,
                books: books
            }

            commit('setData', data)
        } catch(e) {
            throw e
        }
    },
    async createWallet({ dispatch, commit, rootGetters }) {
        try {
            const coinRef = await dispatch('collection')

            // ウォレットアドレスは仮にuidとする
            const data = {
                address: rootGetters.user.uid,
                name: rootGetters.user.email.split('@')[0],
                balance: 0
            }

            await coinRef.doc(rootGetters.user.uid).set(data)

            commit('setData', data)
        } catch(e) {
            throw e
        }
    },
    async saveBook({ state, dispatch, commit, rootGetters }, { address, name }) {
        try {
            const coinRef = await dispatch('collection')
            
            const exist = state.books.some(item => item.address == address)

            if (exist) {
                throw new Error('すでにAddressが登録されています')
            }

            const data = {
                address: address,
                name: name
            }

            await coinRef.doc(rootGetters.user.uid).collection('books').add(data)

            commit('addBook', data)
        } catch(e) {
            throw e
        }
    },
    async send({ dispatch, rootGetters }, { address, value }) {
        try {
            const coinRef = await dispatch('collection')

            // addressが存在するかのチェックをかける
            const snapshot = await coinRef.where('address', '==', address).get()
            
            if (snapshot.empty) {
                throw new Error('入力されたWallet Addressは存在しません')
            }

            const val = value - 0   // 数値変換
            
            const destKey = snapshot.docs[0].id
            const srcKey = rootGetters.user.uid

            const destRef = coinRef.doc(destKey)
            const destTranRef = destRef.collection('transactions').doc()

            const srcRef = coinRef.doc(srcKey)
            const srcTranRef = srcRef.collection('transactions').doc()

            // トランザクションにて読み込みと書き込みを実施
            await db.runTransaction(async transaction => {
                const [destDoc, , srcDoc,] = await Promise.all([
                    transaction.get(destRef),
                    transaction.get(destTranRef),
                    transaction.get(srcRef),
                    transaction.get(srcTranRef)
                ]);

                const now = new Date()

                transaction.update(destRef, {
                    balance: destDoc.data().balance + val
                })

                transaction.set(destTranRef, {
                    from_to: srcDoc.data().address,
                    name: srcDoc.data().name,
                    type: 2,
                    date: now,
                    value: val
                })

                transaction.update(srcRef, {
                    balance: srcDoc.data().balance - val
                })

                transaction.set(srcTranRef, {
                    from_to: destDoc.data().address,
                    name: destDoc.data().name,
                    type: 1,
                    date: now,
                    value: val
                })
            })

            await dispatch('load')
        } catch(e) {
            throw e
        }
    }
}
  
export const getters = {
    address: state => state.address,
    balance: state => state.balance,
    transactions: state => state.transactions,
    books: state => state.books
}