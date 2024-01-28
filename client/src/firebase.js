// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-23b98.firebaseapp.com",
  projectId: "mern-estate-23b98",
  storageBucket: "mern-estate-23b98.appspot.com",
  messagingSenderId: "242167666837",
  appId: "1:242167666837:web:1ba9c763fa2fbe168ce39c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
