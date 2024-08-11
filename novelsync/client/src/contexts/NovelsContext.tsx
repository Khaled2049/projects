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
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {
  UpdateNovelParams,
  CreateNovelParams,
  INovelWithChapters,
  IChapter,
} from "../types/INovel";

import { firestore, storage, auth } from "../config/firebase";
import {
  ref,
  deleteObject,
  uploadString,
  getDownloadURL,
  listAll,
} from "firebase/storage";

interface NovelsContextValue {
  novels: INovelWithChapters[];
  setNovels: React.Dispatch<React.SetStateAction<INovelWithChapters[]>>;
  updateNovelById: ({
    id,
    title,
    chapters,
  }: UpdateNovelParams) => Promise<boolean>;
  deleteNovelById: (novel: INovelWithChapters) => Promise<boolean>;
  createNovel: ({
    user,
    title,
    chapters,
  }: CreateNovelParams) => Promise<string | null>;
  fetchNovels: (limitCount?: number) => void;
  fetchNovelById: (id: string) => void;
  fetchNovelsByUserId: (userId: string) => void;
  userNovels: INovelWithChapters[];
  suggestion: string;
  setsuggestion: React.Dispatch<React.SetStateAction<string>>;
  novelLoading: boolean;
  novelError: string | null;
  deleteLoading: boolean;
  deleteError: string | null;
  updateLoading: boolean;
  updateError: string | null;
  createLoading: boolean;
  createError: string | null;
  selectedNovel: INovelWithChapters;
  fetchNovelByIdLoading: boolean;
  fetchNovelByIdError: string | null;
  setSelectedNovel: React.Dispatch<React.SetStateAction<INovelWithChapters>>;
}

const NovelsContext = createContext<NovelsContextValue | undefined>(undefined);
const NUMBER_OF_NOVELS_LIMIT = 10;
const TOTAL_NOVELS_LIMIT = 100;
const NovelsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [novels, setNovels] = useState<INovelWithChapters[]>([]);
  const [selectedNovel, setSelectedNovel] = useState<INovelWithChapters>({
    id: "",
    chaptersPath: "",
    author: "",
    authorId: "",
    lastUpdated: "",
    title: "",
    chapters: [],
    firstChapter: {
      chapterName: "",
      content: "",
    },
  });

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

  const [suggestion, setsuggestion] = useState("");

  const [userNovels, setUserNovels] = useState<INovelWithChapters[]>([]);
  const [_userNovelsLoading, setUserNovelsLoading] = useState(true);
  const [_userNovelsError, setUserNovelsError] = useState<string | null>(null);

  const fetchNovelsByUserId = async (userId: string) => {
    try {
      const q = query(
        collection(firestore, "novels"),
        where("authorId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const novelsData = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as INovelWithChapters)
      );
      setUserNovels(novelsData);
    } catch (err) {
      setUserNovelsError((err as Error).message);
    } finally {
      setUserNovelsLoading(false);
    }
  };
  const fetchNovelById = async (id: string) => {
    try {
      setFetchNovelByIdLoading(true);
      setFetchNovelByIdError(null);

      // Fetch the novel document
      const novelDoc = await getDoc(doc(firestore, "novels", id));

      if (!novelDoc.exists()) {
        throw new Error("Novel not found");
      }

      const novelData = novelDoc.data();

      const chaptersPath = `novels/${id}/chapters`;
      const chaptersRef = ref(storage, chaptersPath);
      const chapterFolders = await listAll(chaptersRef);

      const chaptersContent: IChapter[] = [];

      for (const folderRef of chapterFolders.prefixes) {
        const chapterFiles = await listAll(folderRef);
        for (const fileRef of chapterFiles.items) {
          const chapterURL = await getDownloadURL(fileRef);
          const chapterResponse = await fetch(chapterURL);
          const chapterContent = await chapterResponse.text();
          const chapterName = fileRef.name.replace(".txt", "");

          chaptersContent.push({ chapterName, content: chapterContent });
        }
      }

      const novelDataWithChapters = {
        id: id,
        author: novelData.author,
        authorId: novelData.authorId,
        lastUpdated: novelData.lastUpdated,
        title: novelData.title,
        chaptersPath: novelData.chaptersPath,
        chapters: chaptersContent,
        firstChapter: chaptersContent[0] || { chapterName: "", content: "" },
      };

      setSelectedNovel(novelDataWithChapters);
    } catch (err) {
      setFetchNovelByIdError((err as Error).message);
    } finally {
      setFetchNovelByIdLoading(false);
    }
  };

  const updateNovelById = async ({
    id,
    title,
    chapters,
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

      // Update chapters if provided
      if (chapters) {
        for (const [index, chapter] of chapters.entries()) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(chapter.content, "text/html");
          const images = doc.querySelectorAll("img");

          // Upload images and replace URLs
          for (let img of images) {
            const imgSrc = img.getAttribute("src");
            if (imgSrc && imgSrc.startsWith("data:image")) {
              // It's a base64 image, need to upload
              const imgRef = ref(
                storage,
                `novels/${id}/chapters/${index + 1}/images/${Date.now()}.png`
              );
              try {
                await uploadString(imgRef, imgSrc, "data_url");
                const newUrl = await getDownloadURL(imgRef);
                img.setAttribute("src", newUrl);
              } catch (err) {
                console.error("Error uploading image:", err);
                throw new Error("Error uploading image");
              }
            }
          }

          // Get the updated content with new image URLs
          const updatedContent = doc.body.innerHTML;

          // Save chapter content to Firebase Storage
          const chapterContentPath = `novels/${id}/chapters/${index + 1}/${
            chapter.chapterName
          }.txt`;
          const storageRef = ref(storage, chapterContentPath);
          try {
            await uploadString(storageRef, updatedContent);
          } catch (err) {
            console.error("Error uploading chapter content:", err);
            throw new Error("Error uploading chapter content");
          }
        }
      }

      // Only proceed with update if there are changes
      if (Object.keys(updateData).length > 0) {
        updateData.lastUpdated = new Date().toISOString();
        await updateDoc(novelRef, updateData);
      }

      // Update the state
      setNovels((prevNovels) =>
        prevNovels.map((novel) =>
          novel.id === id ? { ...novel, ...updateData } : novel
        )
      );

      setUserNovels((prevNovels) =>
        prevNovels.map((novel) =>
          novel.id === id ? { ...novel, ...updateData } : novel
        )
      );

      setUpdateLoading(false);
      return true;
    } catch (err) {
      setUpdateError((err as Error).message);
      setUpdateLoading(false);
      return false;
    }
  };

  const deleteNovelById = async (novel: INovelWithChapters) => {
    try {
      setdeleteLoading(true);
      setDeleteError(null);

      // Delete all chapters and their content
      const chaptersRef = ref(storage, `novels/${novel.id}/chapters`);
      const chaptersListResult = await listAll(chaptersRef);

      // Delete chapter folders
      for (const chapterFolderRef of chaptersListResult.prefixes) {
        const chapterContentsResult = await listAll(chapterFolderRef);

        // Delete all files in the chapter folder (content and images)
        for (const itemRef of chapterContentsResult.items) {
          await deleteObject(itemRef);
        }
      }

      // Delete the Firestore document
      await deleteDoc(doc(firestore, "novels", novel.id));

      // Update the state
      setNovels((prevNovels) => prevNovels.filter((n) => n.id !== novel.id));
      setUserNovels((prevNovels) =>
        prevNovels.filter((n) => n.id !== novel.id)
      );

      setdeleteLoading(false);
      return true;
    } catch (err) {
      console.error("Error deleting novel:", err);
      setDeleteError((err as Error).message);
      setdeleteLoading(false);
      return false;
    }
  };

  // Each user should be able to only create 10 novels for now.
  // Only 100 novels in DB for now.
  const createNovel = async ({ user, title, chapters }: CreateNovelParams) => {
    if (!user) {
      setCreateError("User not authenticated");
      return null;
    }

    setCreateLoading(true);
    setCreateError(null);

    try {
      // Check the number of existing novels for the user
      const novelsCollection = collection(firestore, "novels");
      const userNovelsQuery = query(
        novelsCollection,
        where("authorId", "==", user.uid)
      );

      const totalNovelsSnapshot = await getDocs(novelsCollection);
      if (totalNovelsSnapshot.size >= TOTAL_NOVELS_LIMIT) {
        setCreateError("MAX_NOVELS");
        setCreateLoading(false);
        return null;
      }

      const userNovelsSnapshot = await getDocs(userNovelsQuery);

      if (userNovelsSnapshot.size >= NUMBER_OF_NOVELS_LIMIT) {
        setCreateError("LIMIT_ERR");
        setCreateLoading(false);
        return null;
      }

      // Create a new document in the novels collection
      const newNovelRef = await addDoc(novelsCollection, {
        author: user.username || "Unknown Author",
        authorId: user.uid,
        lastUpdated: new Date().toISOString(),
        title,
      });

      // Process each chapter
      const chapterRefs: IChapter[] = [];
      for (const [index, chapter] of chapters.entries()) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(chapter.content, "text/html");
        const images = doc.querySelectorAll("img");

        // Upload images and replace URLs
        for (let img of images) {
          const imgSrc = img.getAttribute("src");
          if (imgSrc && imgSrc.startsWith("data:image")) {
            // It's a base64 image, need to upload
            const imgRef = ref(
              storage,
              `novels/${newNovelRef.id}/chapters/${
                index + 1
              }/images/${Date.now()}.png`
            );
            try {
              await uploadString(imgRef, imgSrc, "data_url");
              const newUrl = await getDownloadURL(imgRef);
              img.setAttribute("src", newUrl);
            } catch (err) {
              console.error("Error uploading image:", err);
              setCreateError("Error uploading image");
              setCreateLoading(false);
              return null;
            }
          }
        }

        // Get the updated content with new image URLs
        const updatedContent = doc.body.innerHTML;

        // Save chapter content to Firebase Storage
        const chapterContentPath = `novels/${newNovelRef.id}/chapters/${
          index + 1
        }/${chapter.chapterName}.txt`;
        const storageRef = ref(storage, chapterContentPath);
        try {
          await uploadString(storageRef, updatedContent);
        } catch (err) {
          console.error("Error uploading chapter content:", err);
          setCreateError("Error uploading chapter content");
          setCreateLoading(false);
          return null;
        }

        // Add the chapter reference to the array
        chapterRefs.push({
          chapterName: chapter.chapterName,
          content: updatedContent,
        });
      }

      // Update the novel document with chapters collection reference
      try {
        await setDoc(
          newNovelRef,
          { chaptersPath: `novels/${newNovelRef.id}/chapters` },
          { merge: true }
        );
      } catch (err) {
        console.error("Error updating novel document:", err);
      }

      // Update the state
      setNovels((prevNovels) => [
        {
          id: newNovelRef.id,
          title,
          authorId: user.uid,
          author: user.username || "Unknown Author",
          lastUpdated: new Date().toISOString(),
          contentPath: `novels/${newNovelRef.id}`,
          chapters: chapterRefs,
          chaptersPath: `novels/${newNovelRef.id}/chapters`,
          firstChapter: chapterRefs[0] || { chapterName: "", content: "" },
        },
        ...prevNovels,
      ]);

      setCreateLoading(false);
      return newNovelRef.id;
    } catch (err) {
      console.error("Error creating novel:", err);
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
          } as INovelWithChapters)
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
    updateNovelById,
    deleteNovelById,
    createNovel,
    fetchNovels,
    fetchNovelById,
    fetchNovelsByUserId,
    setSelectedNovel,
    suggestion,
    setsuggestion,
    userNovels,
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
