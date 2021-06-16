import Firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCqE2tkNt2KbBNiyKuZnR_LNOn1bS4we0A",
  authDomain: "pied-piper-818c9.firebaseapp.com",
  projectId: "pied-piper-818c9",
  storageBucket: "pied-piper-818c9.appspot.com",
  messagingSenderId: "97675999272",
  appId: "1:97675999272:web:60b6333232814d9f5d1d1d",
  measurementId: "G-RPCQJQS1B6"
};

const app = Firebase.initializeApp(firebaseConfig);
export const db = app.database();

