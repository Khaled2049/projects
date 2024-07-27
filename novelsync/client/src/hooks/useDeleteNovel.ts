import { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { firestore, storage } from "../config/firebase";

const useDeleteNovel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteNovel = async (novelId: string, contentPath: string) => {
    setLoading(true);
    setError(null);

    try {
      const contentRef = ref(storage, contentPath);
      await deleteObject(contentRef);
      await deleteDoc(doc(firestore, "novels", novelId));

      setLoading(false);
      return true;
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
      return false;
    }
  };

  return { deleteNovel, loading, error };
};

export default useDeleteNovel;
