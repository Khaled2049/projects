import React, { createContext, useState, ReactNode, FC } from "react";
import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  getDoc,
  updateDoc,
  addDoc,
  setDoc,
  DocumentData,
} from "firebase/firestore";
import {
  INovel,
  UpdateNovelParams,
  CreateNovelParams,
  ICurrentNovel,
} from "../types/INovel";

import { firestore, storage, auth } from "../config/firebase";
import {
  ref,
  deleteObject,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { doc, deleteDoc } from "firebase/firestore";

interface NovelsContextValue {
  novels: INovel[];
  setNovels: React.Dispatch<React.SetStateAction<INovel[]>>;
  editNovelById: ({ id, title, newContent }: UpdateNovelParams) => void;
  deleteNovelById: (novel: INovel) => Promise<boolean>;
  createNovel: ({
    user,
    title,
    content,
  }: CreateNovelParams) => Promise<string | null>;
  fetchNovels: (limitCount?: number) => void;
  fetchNovelById: (id: string) => void;
  novelLoading: boolean;
  novelError: string | null;
  deleteLoading: boolean;
  deleteError: string | null;
  updateLoading: boolean;
  updateError: string | null;
  createLoading: boolean;
  createError: string | null;
  selectedNovel: DocumentData | null;
  fetchNovelByIdLoading: boolean;
  fetchNovelByIdError: string | null;
}

const NovelsContext = createContext<NovelsContextValue | undefined>(undefined);

const NovelsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [novels, setNovels] = useState<INovel[]>([]);
  const [selectedNovel, setSelectedNovel] = useState<DocumentData | null>(null);

  const [novelLoading, setNovelLoading] = useState(true);
  const [novelError, setNovelError] = useState<string | null>(null);

  const [deleteLoading, setdeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [fetchNovelByIdLoading, setFetchNovelByIdLoading] = useState(false);
  const [fetchNovelByIdError, setFetchNovelByIdError] = useState<string | null>(
    null
  );

  const fetchNovelById = async (id: string) => {
    const [isLoading, setIsLoading] = useState(false);
    try {
      // Fetch novel document from Firestore
      const novelDoc = await getDoc(doc(firestore, "novels", id));

      if (!novelDoc.exists()) {
        throw new Error("Novel not found");
      }

      if (isLoading) return; // Prevent multiple simultaneous loads
      setIsLoading(true);

      const novelData = novelDoc.data() as ICurrentNovel;

      // Fetch novel content from Storage
      const contentRef = ref(storage, novelData.contentPath);
      const contentURL = await getDownloadURL(contentRef);
      const contentResponse = await fetch(contentURL);
      const novelContent = await contentResponse.text();

      console.log("setting selected novel");

      setSelectedNovel({ novelData, novelContent });
    } catch (err) {
      setFetchNovelByIdError((err as Error).message);
    } finally {
      setFetchNovelByIdLoading(false);
      setIsLoading(false);
    }
  };

  const editNovelById = async ({
    id,
    title,
    newContent,
  }: UpdateNovelParams) => {
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

      setUpdateLoading(false);
      return true;
    } catch (err) {
      setUpdateError((err as Error).message);
      setUpdateLoading(false);
      return false;
    }
  };

  const deleteNovelById = async (novel: INovel) => {
    try {
      const contentRef = ref(storage, novel.contentPath);
      await deleteObject(contentRef);
      await deleteDoc(doc(firestore, "novels", novel.id));

      setdeleteLoading(false);
      return true;
    } catch (err) {
      setDeleteError((err as Error).message);
      setdeleteLoading(false);
      return false;
    }
  };

  const createNovel = async ({ user, title, content }: CreateNovelParams) => {
    if (!user) {
      setCreateError("User not authenticated");
      return null;
    }

    setCreateLoading(true);
    setCreateError(null);

    console.log("Creating novel:", title);

    try {
      // Create a new document in the novels collection
      const novelsCollection = collection(firestore, "novels");
      const newNovelRef = await addDoc(novelsCollection, {
        title,
        authorId: user.uid,
        author: user.username,
        lastUpdated: new Date().toISOString(),
      });

      // Save content to Firebase Storage
      const storageRef = ref(storage, `novels/${newNovelRef.id}/${title}.txt`);
      await uploadString(storageRef, content);

      await setDoc(
        newNovelRef,
        { contentPath: storageRef.fullPath },
        { merge: true }
      );

      setCreateLoading(false);
      return newNovelRef.id;
    } catch (err) {
      setCreateError((err as Error).message);
      setCreateLoading(false);
      return null;
    }
  };

  const fetchNovels = async (limitCount: number = 10) => {
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
          } as INovel)
      );

      setNovels(fetchedNovels);
    } catch (err) {
      setNovelError((err as Error).message);
    } finally {
      setNovelLoading(false);
    }
  };

  const valuesToshare: NovelsContextValue = {
    novels,
    setNovels,
    editNovelById,
    deleteNovelById,
    createNovel,
    fetchNovels,
    fetchNovelById,
    novelLoading,
    novelError,
    deleteLoading,
    deleteError,
    updateLoading,
    updateError,
    createLoading,
    createError,
    selectedNovel,
    fetchNovelByIdLoading,
    fetchNovelByIdError,
  };

  return (
    <NovelsContext.Provider value={valuesToshare}>
      {children}
    </NovelsContext.Provider>
  );
};

export { NovelsProvider };
export default NovelsContext;
