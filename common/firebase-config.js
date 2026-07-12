import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, addDoc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_2WsbDLmbWlRd6H6Wu1v6tE3ZQw2aTDE",
  authDomain: "bringo-f6d36.firebaseapp.com",
  projectId: "bringo-f6d36",
  storageBucket: "bringo-f6d36.firebasestorage.app",
  messagingSenderId: "1020896490319",
  appId: "1:1020896490319:web:acb75804261445df294b3a",
  measurementId: "G-8R0RNDBQQF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

export { db, auth, storage, provider, signInWithPopup, signOut, onAuthStateChanged, collection, getDocs, doc, getDoc, setDoc, addDoc, updateDoc, query, where, ref, uploadBytes, getDownloadURL };
