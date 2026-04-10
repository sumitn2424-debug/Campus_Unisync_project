const {initializeApp} = require("firebase/app");
const {getAuth} = require("firebase/auth");
const {getFirestore} = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCbu_ysn9VJ2v6VMrttAJCQSmcWLUsQmKA",
  authDomain: "unysync.firebaseapp.com",
  projectId: "unysync",
  storageBucket: "unysync.firebasestorage.app",
  messagingSenderId: "743797526647",
  appId: "1:743797526647:web:37fca97f87b8c3d4673672",
  measurementId: "G-VB6VWWFLKQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

module.exports = {auth, db};