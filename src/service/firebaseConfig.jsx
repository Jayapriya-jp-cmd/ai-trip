// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0SdxFEfss-z5vpToRuP6fgwcY9axXq4g",
  authDomain: "ai-trip-planner-3063b.firebaseapp.com",
  projectId: "ai-trip-planner-3063b",
  storageBucket: "ai-trip-planner-3063b.firebasestorage.app",
  messagingSenderId: "73605001997",
  appId: "1:73605001997:web:ee843d9e98a0e4d1033644",
  measurementId: "G-VRQ7Y0W513"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
// const analytics = getAnalytics(app);