import { useState, useEffect } from "react";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import { firestore } from "../config/firebase";

interface Novel {
  id: string;
  title: string;
  author: string;
  lastUpdated: string;
}

export const useNovels = (limitCount: number = 10) => {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const novelsCollection = collection(firestore, "novels");
        const novelsQuery = query(
          novelsCollection,
          orderBy("lastUpdated", "desc"),
          limit(limitCount)
        );
        const querySnapshot = await getDocs(novelsQuery);
        const fetchedNovels = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Novel)
        );
        setNovels(fetchedNovels);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchNovels();
  }, [limitCount]);

  return { novels, loading, error };
};
