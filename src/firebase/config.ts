// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDwIFF5f-1XnCd4Z52OOTMjGuAMOaWjr6Y",
    authDomain: "astro-auth-7c9f9.firebaseapp.com",
    projectId: "astro-auth-7c9f9",
    storageBucket: "astro-auth-7c9f9.firebasestorage.app",
    messagingSenderId: "1067369634018",
    appId: "1:1067369634018:web:d41f4c9a528562632966bb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export const firebase = {
    app,
    auth,
}