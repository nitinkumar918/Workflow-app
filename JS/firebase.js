/**
 * Firebase Initialization & Cloud Integration Setup
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCX_rnOp4M9DBq5AwtSyQBcPU_6oz-_9y4",
  authDomain: "task-flow-b7d9e.firebaseapp.com",
  projectId: "task-flow-b7d9e",
  storageBucket: "task-flow-b7d9e.firebasestorage.app",
  messagingSenderId: "84991029942",
  appId: "1:84991029942:web:8147feea169e3685d96c17",
  measurementId: "G-KGR9VQR829"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);