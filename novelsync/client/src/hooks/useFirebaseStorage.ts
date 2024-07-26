import { useState } from "react";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { storage, firestore } from "../config/firebase"; // Import the initialized services

export const useFirebaseStorage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const saveContent = async (content: string) => {
    if (!user) {
      setError("User not authenticated");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Save content to Firebase Storage
      const storageRef = ref(storage, `novels/${user.uid}/content.txt`);
      await uploadString(storageRef, content);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Save metadata to Firestore
      const novelRef = doc(firestore, "novels", user.uid);
      await setDoc(
        novelRef,
        {
          lastUpdated: new Date().toISOString(),
          contentURL: downloadURL,
        },
        { merge: true }
      );

      setLoading(false);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  const loadContent = async () => {
    if (!user) {
      setError("User not authenticated");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const novelRef = doc(firestore, "novels", user.uid);
      const novelDoc = await getDoc(novelRef);

      if (novelDoc.exists()) {
        const { contentURL } = novelDoc.data();
        const response = await fetch(contentURL);
        const content = await response.text();
        setLoading(false);
        return content;
      } else {
        setLoading(false);
        return null;
      }
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
      return null;
    }
  };

  return { saveContent, loadContent, loading, error };
};
