import { useState } from "react";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc, addDoc, collection } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { storage, firestore } from "../config/firebase";

interface Novel {
  id: string;
  title: string;
  contentURL: string;
  authorId: string;
  author: string;
  lastUpdated: string;
}

export const useFirebaseStorage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createNovel = async (title: string, content: string) => {
    if (!user) {
      setError("User not authenticated");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Create a new document in the novels collection
      const novelsCollection = collection(firestore, "novels");
      const newNovelRef = await addDoc(novelsCollection, {
        title,
        authorId: user.uid,
        author: user.email,
        lastUpdated: new Date().toISOString(),
      });

      // Save content to Firebase Storage
      const storageRef = ref(storage, `novels/${newNovelRef.id}/content.txt`);
      await uploadString(storageRef, content);

      // Get the download URL
      const contentURL = await getDownloadURL(storageRef);

      // Update the Firestore document with the content URL
      await setDoc(newNovelRef, { contentURL }, { merge: true });

      setLoading(false);
      return newNovelRef.id;
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
      return null;
    }
  };

  const saveContent = async (novelId: string, content: string) => {
    if (!user) {
      setError("User not authenticated");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Save content to Firebase Storage
      const storageRef = ref(storage, `novels/${novelId}/content.txt`);
      await uploadString(storageRef, content);

      // Get the download URL
      const contentURL = await getDownloadURL(storageRef);

      // Update Firestore document
      const novelRef = doc(firestore, "novels", novelId);
      await setDoc(
        novelRef,
        {
          lastUpdated: new Date().toISOString(),
          contentURL,
        },
        { merge: true }
      );

      setLoading(false);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  const loadContent = async (novelId: string) => {
    setLoading(true);
    setError(null);

    try {
      const novelRef = doc(firestore, "novels", novelId);
      const novelDoc = await getDoc(novelRef);

      if (novelDoc.exists()) {
        const { contentURL } = novelDoc.data() as Novel;
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

  return { createNovel, saveContent, loadContent, loading, error };
};
