import firebase from "firebase/app";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA2hxPW1qn6BscvSLmH5UA4ZacRtpDLwy4",
  authDomain: "code-exp-moh-database.firebaseapp.com",
  databaseURL: "https://code-exp-moh-database-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "code-exp-moh-database",
  storageBucket: "code-exp-moh-database.appspot.com",
  messagingSenderId: "122734261014",
  appId: "1:122734261014:web:db8ec1c916ac542bbc1637"
};

if (!firebase.apps.length) {
  db = firebase.initializeApp(firebaseConfig);
} else {
  db = firebase.app(); // if already initialized, use that one
}

export default {db};