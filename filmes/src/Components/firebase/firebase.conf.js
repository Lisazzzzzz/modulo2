// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAslQ189JdRcg1PKKKkwYaB_BcFScCuqOU",
  authDomain: "focus-fbe72.firebaseapp.com",
  projectId: "focus-fbe72",
  storageBucket: "focus-fbe72.firebasestorage.app",
  messagingSenderId: "1047681257477",
  appId: "1:1047681257477:web:519c53041592b9a6340c6c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

