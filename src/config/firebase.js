import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBuIWNkkqkf35GoIGwnU8nHgwnSPr8q95c",
    authDomain: "benchmarkingaccountants.firebaseapp.com",
    projectId: "benchmarkingaccountants",
    storageBucket: "benchmarkingaccountants.firebasestorage.app",
    messagingSenderId: "729806030203",
    appId: "1:729806030203:web:e71a6b6771ee26040de9de",
    measurementId: "G-LC1HYVYJZZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider()

const db = getFirestore(app);

export { app, auth, googleProvider, db };
// const analytics = getAnalytics(app);