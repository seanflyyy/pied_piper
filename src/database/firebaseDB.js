import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDDTOCkLqd-A_ZlOQ6ZYIwVbDY1O2vCH5k",
  authDomain: "foodie-cdcb5.firebaseapp.com",
  projectId: "foodie-cdcb5",
  storageBucket: "foodie-cdcb5.appspot.com",
  messagingSenderId: "687372832901",
  appId: "1:687372832901:web:301a41349042b68a46d9ec",
  measurementId: "G-4NNW7SG3HG"
};

  firebase.initializeApp(firebaseConfig);
  firebase.firestore();

  export default firebase; 

