import db from '~/plugins/db'
import ethWeb3 from '~/plugins/ethWeb3'
import ethContract from '~/plugins/eth'
import { state as baseState, mutations as baseMutations, actions as baseActions, getters as baseGetters } from '~/store/base'

export const strict = false

export const state = () => (_.cloneDeep(baseState()))

export const mutations = _.cloneDeep(baseMutations)
  
export const actions = _.cloneDeep(baseActions)

actions.collection = () => db.collection('eth')

actions.load = async function({ dispatch, commit, rootGetters }) {
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
               const result = await ethContract.methods.balanceOf(data.address).call({ from: data.address }).catch(() => ethWeb3.utils.toWei("0", "ether"))
               data.balance = ethWeb3.utils.fromWei(result.toString(10), 'ether')

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
}

actions.createWallet = async function({ dispatch, commit, rootGetters }, passphrase) {
  try {
     const coinRef = await dispatch('collection')

     const pp = passphrase.join()
     const ethAcct = ethWeb3.eth.accounts.create(pp)

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
}

actions.send = async function({ dispatch, rootGetters }, { address, value }) {
  try {

     const coinRef = await dispatch('collection')

     const doc = await coinRef.doc(rootGetters.user.uid).get()

     //	    ethContract.options.defaultAccount = ethContract._defaultAccount = doc.data().address
     //          await ethContract.accounts.privateKeyToAccount(doc.data().ethPrivKey)

     ethContract.methods.transfer(address, ethWeb3.utils.toWei(value, "ether")).send({ from: doc.data().address }).on('confirmation', async (confirmationNumber, receipt) => {
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

export const getters = _.cloneDeep(baseGetters)
