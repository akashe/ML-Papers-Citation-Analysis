// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXVFJNH4_w9nK--ewqdZ86BncnX6Ptp0k",
  authDomain: "ml-citation-analysis.firebaseapp.com",
  projectId: "ml-citation-analysis",
  storageBucket: "ml-citation-analysis.appspot.com",
  messagingSenderId: "299905150028",
  appId: "1:299905150028:web:92d3590cf84346411358e9",
  measurementId: "G-GP8PB6G3GJ"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };