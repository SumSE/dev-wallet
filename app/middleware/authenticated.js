import firebase from '~/plugins/firebase'
import db from '~/plugins/db'

export default function({ app, store, route, redirect }) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {

            store.commit('setUser', user)

            ;(async () => {
    
                const coinRef = db.collection('xcmg')
                const doc = await coinRef.doc(user.uid).get()
                const docData = doc.data()
    
                store.commit('setUserInfo', docData)

            })()

            if (route.name === 'signin') {
                redirect('/')
            }
        } else {
            if (route.name !== 'signin') {
                redirect('/signin')
            }
        }
    });
}