import firebase from 'firebase/app'
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCqE2tkNt2KbBNiyKuZnR_LNOn1bS4we0A",
  authDomain: "pied-piper-818c9.firebaseapp.com",
  databaseURL: "https://pied-piper-818c9-default-rtdb.firebaseio.com",
  projectId: "pied-piper-818c9",
  storageBucket: "pied-piper-818c9.appspot.com",
  messagingSenderId: "97675999272",
  appId: "1:97675999272:web:60b6333232814d9f5d1d1d",
  measurementId: "G-RPCQJQS1B6"
};

firebase.initializeApp(firebaseConfig);

function storeHighScore(userId, score) {
  firebase
    .database()
    .ref('users/' + userId)
    .set({
      highscore: score,
    });
}