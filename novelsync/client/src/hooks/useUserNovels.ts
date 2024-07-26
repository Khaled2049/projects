import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../config/firebase";

export interface Novel {
  id: string;
  title: string;
  authorId: string;
  author: string;
  lastUpdated: string;
  contentPath: string;
}

export const useUserNovels = () => {
  const { user } = useAuth();
  const [userNovels, setUserNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchUserNovels = async () => {
      try {
        const q = query(
          collection(firestore, "novels"),
          where("authorId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const novelsData = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Novel)
        );
        setUserNovels(novelsData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserNovels();
  }, [user]);

  return { userNovels, loading, error };
};
