// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8ffUNdK9LXcO_W9_gXsYNEG4d8kNE_RE",
  authDomain: "home-bfdd1.firebaseapp.com",
  projectId: "home-bfdd1",
  storageBucket: "home-bfdd1.appspot.com",
  messagingSenderId: "1089249890239",
  appId: "1:1089249890239:web:bce27459a9cd37e9d35b0a"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();