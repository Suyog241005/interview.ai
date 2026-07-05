import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY!,
  authDomain: "interviewai-95692.firebaseapp.com",
  projectId: "interviewai-95692",
  storageBucket: "interviewai-95692.firebasestorage.app",
  messagingSenderId: "399879892858",
  appId: "1:399879892858:web:5d75be3c724a92f41330c3",
  measurementId: "G-QC1VCBNWT5",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
