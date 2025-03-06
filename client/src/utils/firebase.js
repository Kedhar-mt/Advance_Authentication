// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqdhopxZ6-BoUcOKCufZWm8TeWprHFFUE",
  authDomain: "finalauth-4c595.firebaseapp.com",
  projectId: "finalauth-4c595",
  storageBucket: "finalauth-4c595.firebasestorage.app",
  messagingSenderId: "794332215499",
  appId: "1:794332215499:web:ec1a69fadfe899e6a8434e",
  measurementId: "G-38GDL0LTWQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);