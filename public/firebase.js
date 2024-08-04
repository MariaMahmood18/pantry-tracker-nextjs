// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABIZk2Kt_mBMdoNrPrTeqpW1yHlL5lfjY",
  authDomain: "pantry-tracker-b2d04.firebaseapp.com",
  projectId: "pantry-tracker-b2d04",
  storageBucket: "pantry-tracker-b2d04.appspot.com",
  messagingSenderId: "605057609069",
  appId: "1:605057609069:web:3c29407c627b7247c6fe64",
  measurementId: "G-96X6HH14MY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};