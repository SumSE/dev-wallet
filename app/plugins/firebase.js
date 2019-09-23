import firebase from 'firebase'

if (!firebase.apps.length) {
    firebase.initializeApp({
        
        /*
        apiKey: "AIzaSyCEe8eSTlZfhr1ZgyPZEui41gi0h2gsv3g",
        authDomain: "testabcd-2962c.firebaseapp.com",
        databaseURL: "https://testabcd-2962c.firebaseio.com",
        projectId: "testabcd-2962c",
        storageBucket: "testabcd-2962c.appspot.com",
        messagingSenderId: "1087556312488",
        appId: "1:1087556312488:web:a5816fbcb852700c"
        */        
        
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
