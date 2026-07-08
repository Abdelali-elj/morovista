import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBjF8-LZ8zxnZgaeYUud_17JZIfLTWT8Qg",
  authDomain: "morrovista-agence.firebaseapp.com",
  projectId: "morrovista-agence",
  storageBucket: "morrovista-agence.firebasestorage.app",
  messagingSenderId: "171936152266",
  appId: "1:171936152266:web:b0f12ab2086944b58d1233",
  measurementId: "G-ZX3K0PQC3X"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
