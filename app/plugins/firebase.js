import firebase from 'firebase'

if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyD8GCCC8UemY69XYFLs8UZla8BAK7jHFDQ",
        authDomain: "wallet-1ce6d.firebaseapp.com",
        databaseURL: "https://wallet-1ce6d.firebaseio.com",
        projectId: "wallet-1ce6d",
        storageBucket: "wallet-1ce6d.appspot.com",
        messagingSenderId: "1057402098480"
    })
}

export default firebase