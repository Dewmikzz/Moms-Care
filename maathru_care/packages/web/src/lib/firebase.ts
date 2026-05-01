import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA3OBYWa3AD3iJVGItfN6t9_2VxnnwRmYk",
  authDomain: "maathru-care-f15dd.firebaseapp.com",
  projectId: "maathru-care-f15dd",
  storageBucket: "maathru-care-f15dd.firebasestorage.app",
  messagingSenderId: "886249972347",
  appId: "1:886249972347:web:6bd7081b03f1b6fd2ef8de",
  measurementId: "G-GDR9PRMRM4"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Analytics only in the browser
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, googleProvider, analytics };
