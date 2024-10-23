// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCvxraXo-7YJaaGRiiD3UGs5QJlZXVmw1k",
  authDomain: "not--forms.firebaseapp.com",
  projectId: "not--forms",
  storageBucket: "not--forms.appspot.com",
  messagingSenderId: "785037834798",
  appId: "1:785037834798:web:15d5aa044770f15974fdbf",
};

// Initialize Firebase
const firebaseApp =
  getApps().length > 0
    ? getApp()
    : initializeApp({
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      });

export const auth = getAuth(firebaseApp);

export function registerWithEmailAndPassword(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function loginWithEmailAndPassword(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}
export function logoutUser() {
  return signOut(auth);
}
