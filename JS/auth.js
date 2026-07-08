/**
 * Authentication Engine
 */
import { auth, googleProvider } from './firebase.js';
import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

export class AuthManager {
    constructor(onUserChanged) {
        this.currentUser = null;
        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
            onUserChanged(user);
        });
    }

    async signInWithGoogle() {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Google Sign In Error:", error);
        }
    }

    async logout() {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Sign Out Error:", error);
        }
    }
}