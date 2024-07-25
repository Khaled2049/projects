import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../config/firebase";

export const useFirebaseAuth = () => {
  const [error, setError] = useState<string | null>(null);

  const signup = async (email: string, password: string) => {
    console.log(email, password);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const signin = async (email: string, password: string) => {
    try {
      console.log(email, password);
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
