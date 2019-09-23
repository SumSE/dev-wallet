import db from '~/plugins/db'
import web3 from '~/plugins/web3'
import xcmgContract from '~/plugins/xcmg'

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

         data.balance = data.balance ? data.balance : 0

         if (data.address !== '') {
            if(false) // todo 一時的に無効化
            {
               setTimeout(async () => {
                  const result = await xcmgContract.methods.balanceOf(data.address).call({ from: data.address }).catch(() => web3.utils.toWei("0", "ether"))
                  data.balance = web3.utils.fromWei(result.toString(10), 'ether')
   
                  await coinRef.doc(rootGetters.user.uid).update({
                     balance: data.balance
                  })
                  commit('setData', data)
               }, 0)
            }
         }
         commit('setData', data)

         //setTimeout(() => { dispatch('load') }, 5 * 1000)

      } catch (e) {
         throw e
      }
   },
   async createWallet({ dispatch, commit, rootGetters }, passphrase) {
      try {
         const coinRef = await dispatch('collection')

         const pp = passphrase.join()
         const ethAcct = web3.eth.accounts.create(pp)

         const data = {
            passphrase: pp,
            ethPrivKey: ethAcct.privateKey,
            address: ethAcct.address,
            balance: 0
         }

         await coinRef.doc(rootGetters.user.uid).update(data)

         commit('setData', data)
      } catch (e) {
         throw e
      }
   },
   async saveBook({ state, dispatch, commit, rootGetters }, { address, name }) {
      try {
         const coinRef = await dispatch('collection')

         const exist = state.books.some(item => item.address == address)

         if (exist) {
            throw new Error('Address is already registered.')
         }

         const data = {
            address: address,
            name: name
         }

         await coinRef.doc(rootGetters.user.uid).collection('books').add(data)

         commit('addBook', data)
      } catch (e) {
         throw e
      }
   },
   async send({ dispatch, rootGetters }, { address, value }) {
      try {

         const coinRef = await dispatch('collection')

         const doc = await coinRef.doc(rootGetters.user.uid).get()

         //	    xcmgContract.options.defaultAccount = xcmgContract._defaultAccount = doc.data().address
         //          await xcmgContract.accounts.privateKeyToAccount(doc.data().ethPrivKey)

         xcmgContract.methods.transfer(address, web3.utils.toWei(value, "ether")).send({ from: doc.data().address }).on('confirmation', async (confirmationNumber, receipt) => {
            if (confirmationNumber == 1) {
               console.log(receipt)

               // Check the presence of an address.
               const snapshot = await coinRef.where('address', '==', address).get()

               if (snapshot.empty) {
                  throw new Error('The Wallet Address entered does not exist.')
               }

               const val = value - 0   // numerical transformation

               const destKey = snapshot.docs[0].id
               const srcKey = rootGetters.user.uid

               const destRef = coinRef.doc(destKey)
               const destTranRef = destRef.collection('transactions').doc()

               const srcRef = coinRef.doc(srcKey)
               const srcTranRef = srcRef.collection('transactions').doc()

               // Read and write transactions.
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
            }

         }).on('error', (error) => {

            console.error(error)
            throw new Error('Failed to transfer.')
         });

      } catch (e) {
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
