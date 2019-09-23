import firebase from 'firebase'

if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyChCFT72Kw2kqRT5bOS0G_e3N6he_582I8",
        authDomain: "xcmg-38996.firebaseapp.com",
        databaseURL: "https://xcmg-38996.firebaseio.com",
        projectId: "xcmg-38996",
        storageBucket: "xcmg-38996.appspot.com",
        messagingSenderId: "547907806647",
        appId: "1:547907806647:web:be2f1c82c2974963"                
    })
}

export default firebase
