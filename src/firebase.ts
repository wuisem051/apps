import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKey_ReplaceWithRealOne",
  authDomain: "apps-10a12.firebaseapp.com",
  projectId: "apps-10a12",
  storageBucket: "apps-10a12.firebasestorage.app",
  messagingSenderId: "305108518674",
  appId: "1:305108518674:web:2db01e379943bac09c55cb",
  measurementId: "G-9MR3MMXNXD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
export default app;
