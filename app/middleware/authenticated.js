import firebase from '~/plugins/firebase'

export default function({ app, store, route, redirect }) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            store.commit('setUser', user)
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