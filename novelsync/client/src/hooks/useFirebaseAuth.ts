import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../config/firebase";

export const useFirebaseAuth = () => {
  const [error, setError] = useState<string | null>(null);

  const signup = async (email: string, password: string, username: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update the user's profile with the username
      await updateProfile(user, { displayName: username });

      const dbUser = {
        username: username,
        email: email,
        createdAt: new Date().toISOString(),
      };

      // Store additional user data in Firestore
      await setDoc(doc(firestore, "users", user.uid), dbUser);

      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const signin = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const signout = async () => {
    try {
      await signOut(auth);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return { signup, signin, signout, error };
};
