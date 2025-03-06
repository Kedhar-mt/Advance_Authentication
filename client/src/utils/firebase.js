// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3nhlcIxh1pJhICPXCEA8FVkjHpAVeq1I",
  authDomain: "advance-auth-583fc.firebaseapp.com",
  projectId: "advance-auth-583fc",
  storageBucket: "advance-auth-583fc.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "709750852415",
  appId: "1:709750852415:web:0ead9edf83b1867432218a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Add these scopes to request more user information
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Configure custom parameters for the auth provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, googleProvider };