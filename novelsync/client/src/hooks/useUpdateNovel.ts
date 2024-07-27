import { useState } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { firestore, storage, auth } from "../config/firebase";

interface UpdateNovelParams {
  id: string;
  title?: string;
  newContent?: string;
  // Add other fields that can be updated
}

export const useUpdateNovel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateNovel = async ({ id, title, newContent }: UpdateNovelParams) => {
    setLoading(true);
    setError(null);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      const novelRef = doc(firestore, "novels", id);
      const novelDoc = await getDoc(novelRef);

      if (!novelDoc.exists()) {
        throw new Error("Novel not found");
      }

      const currentNovel = novelDoc.data();

      // Check if the current user is the author of the novel
      if (currentNovel.authorId !== currentUser.uid) {
        throw new Error("You do not have permission to update this novel");
      }

      const updateData: { [key: string]: any } = {};

      // Update title if provided
      if (title && title !== currentNovel.title) {
        updateData.title = title;
      }

      // Update content if provided
      if (newContent !== undefined) {
        // Use the current title if a new one isn't provided
        const contentFileName = `${title || currentNovel.title}.txt`;
        const contentRef = ref(storage, `novels/${id}/${contentFileName}`);

        await uploadString(contentRef, newContent);
        const contentURL = await getDownloadURL(contentRef);

        updateData.contentPath = contentRef.fullPath;
        updateData.contentURL = contentURL;
      }

      // Only proceed with update if there are changes
      if (Object.keys(updateData).length > 0) {
        updateData.lastUpdated = new Date().toISOString();
        await updateDoc(novelRef, updateData);
      }

      setLoading(false);
      return true;
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
      return false;
    }
  };

  return { updateNovel, loading, error };
};
