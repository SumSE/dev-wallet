import firebase from './firebase'

function auth () {
    
    return new Promise((resolve, reject) => {

        firebase.auth().onAuthStateChanged((user) => {
            resolve(user || false)
        })
    })
}

export default auth