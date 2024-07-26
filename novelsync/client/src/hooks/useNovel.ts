import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "../config/firebase";

export interface Novel {
  id: string;
  title: string;
  authorId: string;
  author: string;
  lastUpdated: string;
  contentPath: string; // Changed from contentURL to contentPath
}

export const useNovel = (novelId: string) => {
  const [novel, setNovel] = useState<Novel | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNovel = async () => {
      try {
        // Fetch novel document from Firestore
        const novelDoc = await getDoc(doc(firestore, "novels", novelId));

        if (!novelDoc.exists()) {
          throw new Error("Novel not found");
        }

        const novelData = { id: novelDoc.id, ...novelDoc.data() } as Novel;
        setNovel(novelData);

        // Fetch novel content from Storage
        const contentRef = ref(storage, novelData.contentPath);
        const contentURL = await getDownloadURL(contentRef);
        const contentResponse = await fetch(contentURL);
        const fetchedContent = await contentResponse.text();

        setContent(fetchedContent);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchNovel();
  }, [novelId]);

  return { novel, content, loading, error };
};
