// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6-0fhQKCpuf2ICM8UGRPmK5IXFm1c72E",
  authDomain: "nomad-challenge-twitter-clone.firebaseapp.com",
  projectId: "nomad-challenge-twitter-clone",
  storageBucket: "nomad-challenge-twitter-clone.appspot.com",
  messagingSenderId: "498116077694",
  appId: "1:498116077694:web:fb4bd99cf898c70b31d02f",
  measurementId: "G-JVQGZK6L2Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);