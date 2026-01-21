// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDV1yWjeGYb5FXROCP7phxUsOz_-59tfA8",
  authDomain: "test-a384f.firebaseapp.com",
  databaseURL: "https://test-a384f-default-rtdb.firebaseio.com",
  projectId: "test-a384f",
  storageBucket: "test-a384f.firebasestorage.app",
  messagingSenderId: "276364334701",
  appId: "1:276364334701:web:6be4e018d3b6cebe15d164",
  measurementId: "G-XRHBHZY4KJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const database = getDatabase(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, database, firestore, auth };