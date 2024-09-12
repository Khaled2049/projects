import { createContext, useState, useContext, ReactNode } from "react";
import {
  Chapter,
  CreateDraftParams,
  CreateStoryParams,
  Draft,
  Story,
} from "../types/IStory";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore, storage } from "../config/firebase";

import { isToxic, analyzeText } from "../utils";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadString,
} from "firebase/storage";
import { IUser } from "../types/IUser";

interface EditorContextType {
  title: string;
  setTitle: (title: string) => void;
  currentChapterTitle: string;
  setCurrentChapterTitle: (title: string) => void;
  currentChapters: Chapter[];
  setCurrentChapters: (chapters: Chapter[]) => void;
  stories: Story[];
  drafts: Draft[];
  setStories: (stories: Story[]) => void;
  setDrafts: (drafts: Draft[]) => void;
  editingStoryId: string | null;
  setEditingStoryId: (id: string | null) => void;
  editingChapterId: string | null;
  setEditingChapterId: (id: string | null) => void;
  clearCurrentStory: () => void;
  publishStory: (params: CreateStoryParams) => Promise<string | null>;
  publishLoading: boolean;
  fetchUserStories: (user: IUser) => Promise<void>;
  fetchLoading: boolean;
  userStories: Story[];
  userDrafts: Draft[];
  fetchStoryById: (story: Story) => Promise<Story | null>;
  fetchDraftById: (story: Draft) => Promise<Draft | null>;
  updateStoryById: (params: {
    storyId: string;
    user: IUser;
    newTitle: string;
    chapters: Chapter[];
  }) => Promise<boolean | null | string>;
  deleteStoryById: (story: Story, user: IUser) => Promise<boolean | null>;
  fetchAllStories: () => Promise<Story[]>;
  saveDraft: (params: CreateDraftParams) => Promise<Draft | string | null>;
  fetchUserDrafts: (user: IUser) => Promise<void>;
  deleteDraftById: (draft: Draft, user: IUser) => Promise<boolean | null>;
  updateDraftById: (params: {
    draftId: string;
    user: IUser;
    newTitle: string;
    chapters: Chapter[];
  }) => Promise<boolean | null | string>;
  incrementViewCount: (storyId: string) => Promise<void>;
  incrementLikes: (storyId: string) => Promise<void>;
  likes: number;
  setsuggestion: React.Dispatch<React.SetStateAction<string>>;
  suggestion: string;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const NUMBER_OF_NOVELS_LIMIT = 10;
  const TOTAL_NOVELS_LIMIT = 100;

  const clearCurrentStory = () => {
    setTitle("");
    setCurrentChapters([]);
    setEditingStoryId(null);
    setCurrentChapterTitle("");
    setEditingChapterId(null);
  };

  const [title, setTitle] = useState<string>("");
  const [currentChapterTitle, setCurrentChapterTitle] = useState<string>("");
  const [currentChapters, setCurrentChapters] = useState<Chapter[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);

  const [likes, _setLikes] = useState<number>(0);
  const [publishLoading, setpublishLoading] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);

  const [userStories, setUserStories] = useState<Story[]>([]);
  const [userDrafts, setUserDrafts] = useState<Draft[]>([]);

  const [suggestion, setsuggestion] = useState("");

  const publishStory = async ({
    storyId,
    user,
    title,
    chapters,
  }: CreateStoryParams) => {
    if (!user) {
      console.error("User is not logged");
      return null;
    }
    setpublishLoading(true);

    try {
      // Check the number of existing novels for the user
      const novelsCollection = collection(firestore, "novels");
      const userNovelsQuery = query(
        novelsCollection,
        where("authorId", "==", user.uid)
      );

      const totalNovelsSnapshot = await getDocs(novelsCollection);
      if (totalNovelsSnapshot.size >= TOTAL_NOVELS_LIMIT) {
        return "MAX_NOVELS";
      }

      const userNovelsSnapshot = await getDocs(userNovelsQuery);

      if (userNovelsSnapshot.size >= NUMBER_OF_NOVELS_LIMIT) {
        return "LIMIT_ERR";
      }

      const scores = await analyzeText(title);
      if (isToxic(scores)) {
        return "TOXIC_TITLE";
      }

      // Create a new document in the novels collection
      const newNovelRef = await addDoc(novelsCollection, {
        storyId: storyId,
        author: user.username || "Unknown Author",
        authorId: user.uid,
        lastUpdated: new Date().toISOString(),
        title,
        views: 0,
        likes: 0,
      });

      // Process each chapter
      const chapterRefs: Chapter[] = [];
      for (const chapter of chapters) {
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
                chapter.chapterId
              }/images/${Date.now()}.png`
            );
            try {
              await uploadString(imgRef, imgSrc, "data_url");
              const newUrl = await getDownloadURL(imgRef);
              img.setAttribute("src", newUrl);
            } catch (err) {
              console.error("Error uppublishLoading image:", err);

              return null;
            }
          }
        }

        // Get the updated content with new image URLs
        const updatedContent = doc.body.innerHTML;

        // Save chapter content to Firebase Storage
        const chapterContentPath = `novels/${newNovelRef.id}/chapters/${chapter.chapterId}/${chapter.title}.txt`;
        const storageRef = ref(storage, chapterContentPath);
        try {
          await uploadString(storageRef, updatedContent);
        } catch (err) {
          console.error("Error uppublishLoading chapter content:", err);

          return null;
        }

        // Add the chapter to the collection
        chapterRefs.push({
          chapterId: chapter.chapterId,
          title: chapter.title,
          content: chapterContentPath,
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
      setStories([
        ...stories,
        {
          storyId: newNovelRef.id,
          title,
          chapters: chapterRefs,
          author: user.username || "Unknown Author",
          lastUpdated: new Date().toISOString(),
          views: 0,
          likes: 0,
        },
      ]);

      setUserStories([
        ...userStories,
        {
          storyId: newNovelRef.id,
          title,
          chapters,
          author: user.username || "Unknown Author",
          lastUpdated: new Date().toISOString(),
          views: 0,
          likes: 0,
        },
      ]);

      setpublishLoading(false);

      return newNovelRef.id;
    } catch (err) {
      console.error("Error creating novel:", err);
      return null;
    }
  };

  const incrementViewCount = async (storyId: string) => {
    const storyRef = doc(firestore, "novels", storyId);

    try {
      await updateDoc(storyRef, {
        views: increment(1),
      });
    } catch (error) {
      console.error("Error incrementing views: ", error);
    }
  };

  const saveDraft = async ({
    draftId,
    user,
    title,
    chapters,
  }: CreateDraftParams) => {
    if (!user) {
      console.error("User is not logged");
      return null;
    }

    try {
      // Check the number of existing novels for the user
      const draftsCollection = collection(firestore, "drafts");
      const userDraftQuery = query(
        draftsCollection,
        where("authorId", "==", user.uid)
      );

      const totalNovelsSnapshot = await getDocs(draftsCollection);
      if (totalNovelsSnapshot.size >= TOTAL_NOVELS_LIMIT) {
        return "MAX_NOVELS";
      }

      const userDraftsSnapshot = await getDocs(userDraftQuery);

      if (userDraftsSnapshot.size >= NUMBER_OF_NOVELS_LIMIT) {
        return "LIMIT_ERR";
      }

      // Create a new document in the novels collection
      const newDraftRef = await addDoc(draftsCollection, {
        storyId: draftId,
        author: user.username || "Unknown Author",
        authorId: user.uid,
        lastUpdated: new Date().toISOString(),
        title,
      });

      // Process each chapter
      const chapterRefs: Chapter[] = [];
      for (const chapter of chapters) {
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
              `drafts/${newDraftRef.id}/chapters/${
                chapter.chapterId
              }/images/${Date.now()}.png`
            );
            try {
              await uploadString(imgRef, imgSrc, "data_url");
              const newUrl = await getDownloadURL(imgRef);
              img.setAttribute("src", newUrl);
            } catch (err) {
              console.error("Error uppublishLoading image:", err);

              return null;
            }
          }
        }

        // Get the updated content with new image URLs
        const updatedContent = doc.body.innerHTML;

        // Save chapter content to Firebase Storage
        const chapterContentPath = `drafts/${newDraftRef.id}/chapters/${chapter.chapterId}/${chapter.title}.txt`;
        const storageRef = ref(storage, chapterContentPath);
        try {
          await uploadString(storageRef, updatedContent);
        } catch (err) {
          console.error("Error uppublishLoading chapter content:", err);

          return null;
        }

        // Add the chapter to the collection
        chapterRefs.push({
          chapterId: chapter.chapterId,
          title: chapter.title,
          content: chapterContentPath,
        });
      }

      // Update the novel document with chapters collection reference
      try {
        await setDoc(
          newDraftRef,
          { chaptersPath: `drafts/${newDraftRef.id}/chapters` },
          { merge: true }
        );
      } catch (err) {
        console.error("Error draft document:", err);
      }

      const d = {
        draftId: newDraftRef.id,
        title,
        chapters: chapterRefs,
        author: user.username || "Unknown Author",
        lastUpdated: new Date().toISOString(),
      };

      // Update the state
      setDrafts([...drafts, d]);

      // Return the draft
      return d;
    } catch (err) {
      console.error("Error creating novel:", err);
      return null;
    }
  };

  const deleteStoryById = async (story: Story, user: IUser) => {
    if (!user) {
      console.error("User is not logged in");
      return null;
    }

    try {
      // Delete all chapters and their content
      const chaptersRef = ref(storage, `novels/${story.storyId}/chapters`);
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
      await deleteDoc(doc(firestore, "novels", story.storyId));

      // Update the state
      setStories((prevNovels) =>
        prevNovels.filter((n) => n.storyId !== story.storyId)
      );
      setUserStories((prevNovels) =>
        prevNovels.filter((n) => n.storyId !== story.storyId)
      );

      return true;
    } catch (err) {
      console.error("Error deleting novel:", err);

      return false;
    }
  };
  const deleteDraftById = async (draft: Draft, user: IUser) => {
    if (!user) {
      console.error("User is not logged in");
      return null;
    }

    try {
      // Delete all chapters and their content
      const chaptersRef = ref(storage, `drafts/${draft.draftId}/chapters`);
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
      await deleteDoc(doc(firestore, "drafts", draft.draftId));

      // Update the state
      setDrafts((prevDrafts) =>
        prevDrafts.filter((n) => n.draftId !== draft.draftId)
      );

      setUserDrafts((prevDrafts) =>
        prevDrafts.filter((n) => n.draftId !== draft.draftId)
      );

      return true;
    } catch (err) {
      console.error("Error deleting novel:", err);

      return false;
    }
  };

  const fetchStoryById = async (story: Story) => {
    try {
      // Fetch story by ID from Firestore
      const novelDoc = await getDoc(doc(firestore, "novels", story.storyId));
      if (!novelDoc.exists()) {
        console.error("Story not found");
        return null;
      }

      const novelData = novelDoc.data();
      const chaptersRef = ref(storage, novelData?.chaptersPath);

      // List all chapter folders in Storage
      const chapterFolders = await listAll(chaptersRef);
      const chapters: Chapter[] = [];

      // Iterate over each chapter folder
      for (const folderRef of chapterFolders.prefixes) {
        const chapterFiles = await listAll(folderRef);

        // Iterate over each file in the chapter folder
        for (const fileRef of chapterFiles.items) {
          const chapterId = fileRef.fullPath.split("/")[3];

          // Get the download URL for the file
          const chapterURL = await getDownloadURL(fileRef);

          const chapterResponse = await fetch(chapterURL);

          // Get the text content of the chapter
          const chapterContent = await chapterResponse.text();
          const chapterName = fileRef.name.replace(".txt", "");

          // Push the chapter data into the chapters array
          chapters.push({
            chapterId: chapterId,
            title: chapterName,
            content: chapterContent,
          });
        }
      }

      // Update the story with the fetched chapters
      const updatedStory = {
        ...story,
        chapters,
      };

      // Return or set the updated story as needed
      return updatedStory;
    } catch (err) {
      console.error("Error fetching story:", err);
      return null;
    }
  };

  const fetchDraftById = async (draft: Draft) => {
    try {
      // Fetch story by ID from Firestore

      const novelDoc = await getDoc(doc(firestore, "drafts", draft.draftId));
      if (!novelDoc.exists()) {
        console.error("Story not found");
        return null;
      }

      const novelData = novelDoc.data();
      const chaptersRef = ref(storage, novelData?.chaptersPath);

      // List all chapter folders in Storage
      const chapterFolders = await listAll(chaptersRef);
      const chapters: Chapter[] = [];

      // Iterate over each chapter folder
      for (const folderRef of chapterFolders.prefixes) {
        const chapterFiles = await listAll(folderRef);

        // Iterate over each file in the chapter folder
        for (const fileRef of chapterFiles.items) {
          const chapterId = fileRef.fullPath.split("/")[3];

          // Get the download URL for the file
          const chapterURL = await getDownloadURL(fileRef);

          const chapterResponse = await fetch(chapterURL);

          // Get the text content of the chapter
          const chapterContent = await chapterResponse.text();
          const chapterName = fileRef.name.replace(".txt", "");

          // Push the chapter data into the chapters array
          chapters.push({
            chapterId: chapterId,
            title: chapterName,
            content: chapterContent,
          });
        }
      }

      // Update the story with the fetched chapters
      const updatedStory = {
        ...draft,
        chapters,
      };

      // Return or set the updated story as needed
      return updatedStory;
    } catch (err) {
      console.error("Error fetching story:", err);
      return null;
    }
  };

  const updateStoryById = async ({
    storyId,
    user,
    newTitle,
    chapters,
  }: {
    storyId: string;
    user: IUser;
    newTitle: string;
    chapters: Chapter[];
  }) => {
    if (!user) {
      console.error("User is not logged in");
      return null;
    }

    try {
      // Fetch the existing story document
      const novelDocRef = doc(firestore, "novels", storyId);
      const novelDoc = await getDoc(novelDocRef);

      if (!novelDoc.exists()) {
        console.error("Story not found");
        return null;
      }

      const novelData = novelDoc.data();

      // Check if the title has changed and update it
      if (newTitle !== novelData?.title) {
        const scores = await analyzeText(newTitle);
        if (isToxic(scores)) {
          return "TOXIC_TITLE";
        }

        await updateDoc(novelDocRef, {
          title: newTitle,
          lastUpdated: new Date().toISOString(),
        });
      }

      const updatedChapters: Chapter[] = [];

      for (const chapter of chapters) {
        const chapterRefPath = `novels/${storyId}/chapters/${chapter.chapterId}`;
        const chapterRef = ref(storage, chapterRefPath);

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
              `${chapterRefPath}/images/${Date.now()}.png`
            );
            try {
              await uploadString(imgRef, imgSrc, "data_url");
              const newUrl = await getDownloadURL(imgRef);
              img.setAttribute("src", newUrl);
            } catch (err) {
              console.error("Error uploading image:", err);
              return null;
            }
          }
        }

        // Get the updated content with new image URLs
        const updatedContent = doc.body.innerHTML;

        // Save updated chapter content to Firebase Storage
        const chapterContentPath = `${chapterRefPath}/${chapter.title}.txt`;
        try {
          await uploadString(chapterRef, updatedContent);
        } catch (err) {
          console.error("Error uploading chapter content:", err);
          return null;
        }

        // Add the updated chapter to the collection
        updatedChapters.push({
          chapterId: chapter.chapterId,
          title: chapter.title,
          content: updatedContent, // The updated content with images and other modifications
        });

        // Update the chapter content in Firebase Storage with the new updated content
        const storageRef = ref(storage, chapterContentPath);
        try {
          await uploadString(storageRef, updatedContent);
        } catch (err) {
          console.error("Error updating chapter content in storage:", err);
          return null;
        }
      }

      // Update the novel document with new chapters information
      try {
        await updateDoc(novelDocRef, {
          chaptersPath: `novels/${storyId}/chapters`,
          lastUpdated: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Error updating novel document:", err);
        return null;
      }

      return true;
    } catch (err) {
      console.error("Error updating story:", err);
      return null;
    }
  };
  const updateDraftById = async ({
    draftId,
    user,
    newTitle,
    chapters,
  }: {
    draftId: string;
    user: IUser;
    newTitle: string;
    chapters: Chapter[];
  }) => {
    if (!user) {
      console.error("User is not logged in");
      return null;
    }

    try {
      // Fetch the existing story document
      const draftDocRef = doc(firestore, "drafts", draftId);
      const draftDoc = await getDoc(draftDocRef);

      if (!draftDoc.exists()) {
        console.error("Story not found");
        return null;
      }

      const draftData = draftDoc.data();

      // Check if the title has changed and update it
      if (newTitle !== draftData?.title) {
        const scores = await analyzeText(newTitle);
        if (isToxic(scores)) {
          return "TOXIC_TITLE";
        }

        await updateDoc(draftDocRef, {
          title: newTitle,
          lastUpdated: new Date().toISOString(),
        });
      }

      const updatedChapters: Chapter[] = [];

      for (const chapter of chapters) {
        const chapterRefPath = `drafts/${draftId}/chapters/${chapter.chapterId}`;
        const chapterRef = ref(storage, chapterRefPath);

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
              `${chapterRefPath}/images/${Date.now()}.png`
            );
            try {
              await uploadString(imgRef, imgSrc, "data_url");
              const newUrl = await getDownloadURL(imgRef);
              img.setAttribute("src", newUrl);
            } catch (err) {
              console.error("Error uploading image:", err);
              return null;
            }
          }
        }

        // Get the updated content with new image URLs
        const updatedContent = doc.body.innerHTML;

        // Save updated chapter content to Firebase Storage
        const chapterContentPath = `${chapterRefPath}/${chapter.title}.txt`;
        try {
          await uploadString(chapterRef, updatedContent);
        } catch (err) {
          console.error("Error uploading chapter content:", err);
          return null;
        }

        // Add the updated chapter to the collection
        updatedChapters.push({
          chapterId: chapter.chapterId,
          title: chapter.title,
          content: updatedContent, // The updated content with images and other modifications
        });

        // Update the chapter content in Firebase Storage with the new updated content
        const storageRef = ref(storage, chapterContentPath);
        try {
          await uploadString(storageRef, updatedContent);
        } catch (err) {
          console.error("Error updating chapter content in storage:", err);
          return null;
        }
      }

      // Update the novel document with new chapters information
      try {
        await updateDoc(draftDocRef, {
          chaptersPath: `drafts/${draftId}/chapters`,
          lastUpdated: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Error updating novel document:", err);
        return null;
      }

      return true;
    } catch (err) {
      console.error("Error updating story:", err);
      return null;
    }
  };

  const fetchUserDrafts = async (user: IUser) => {
    setFetchLoading(true);

    try {
      const draftsCollection = collection(firestore, "drafts");
      const userDraftsQuery = query(
        draftsCollection,
        where("authorId", "==", user.uid)
      );

      const userDraftsSnapshot = await getDocs(userDraftsQuery);

      // Clear the userStories state before adding new stories to prevent duplicates
      const newUserDrafts = [];

      // Get user Novels, get chapters of stories and set the state
      for (const doc of userDraftsSnapshot.docs) {
        const novelData = doc.data();
        const chaptersPath = novelData.chaptersPath;
        const chaptersCollection = collection(firestore, chaptersPath);

        const chaptersSnapshot = await getDocs(chaptersCollection);
        const chapters: Chapter[] = [];

        for (const chapterDoc of chaptersSnapshot.docs) {
          const chapterData = chapterDoc.data();
          const contentRef = ref(storage, chapterData.content);
          const contentUrl = await getDownloadURL(contentRef);
          const chapterContent = await fetch(contentUrl).then((res) =>
            res.text()
          );

          chapters.push({
            chapterId: chapterDoc.id,
            title: chapterData.title,
            content: chapterContent,
          });
        }

        // Add the story to the newUserStories array
        newUserDrafts.push({
          draftId: doc.id,
          title: novelData.title,
          chapters,
          author: user.username || "Unknown Author",
          lastUpdated: new Date().toISOString(),
        });
      }

      // Set the new state with the fetched stories
      setUserDrafts(newUserDrafts);

      setFetchLoading(false);
    } catch (err) {
      console.error("Error fetching user stories:", err);
      setFetchLoading(false);
    }
  };
  const fetchUserStories = async (user: IUser) => {
    setFetchLoading(true);

    try {
      const novelsCollection = collection(firestore, "novels");
      const userNovelsQuery = query(
        novelsCollection,
        where("authorId", "==", user.uid)
      );

      const userNovelsSnapshot = await getDocs(userNovelsQuery);

      // Clear the userStories state before adding new stories to prevent duplicates
      const newUserStories = [];

      // Get user Novels, get chapters of stories and set the state
      for (const doc of userNovelsSnapshot.docs) {
        const novelData = doc.data();
        const chaptersPath = novelData.chaptersPath;
        const chaptersCollection = collection(firestore, chaptersPath);

        const chaptersSnapshot = await getDocs(chaptersCollection);
        const chapters: Chapter[] = [];

        for (const chapterDoc of chaptersSnapshot.docs) {
          const chapterData = chapterDoc.data();
          const contentRef = ref(storage, chapterData.content);
          const contentUrl = await getDownloadURL(contentRef);
          const chapterContent = await fetch(contentUrl).then((res) =>
            res.text()
          );

          chapters.push({
            chapterId: chapterDoc.id,
            title: chapterData.title,
            content: chapterContent,
          });
        }

        // Add the story to the newUserStories array
        newUserStories.push({
          storyId: doc.id,
          title: novelData.title,
          chapters,
          author: user.username || "Unknown Author",
          lastUpdated: new Date().toISOString(),
          views: novelData.views,
          likes: novelData.likes,
        });
      }

      // Set the new state with the fetched stories
      setUserStories(newUserStories);

      setFetchLoading(false);
    } catch (err) {
      console.error("Error fetching user stories:", err);
      setFetchLoading(false);
    }
  };

  // check if current user has liked the story
  // const checkUserLiked = async (storyId: string, user: IUser) => {
  //   const novelDocRef = doc(firestore, "novels", storyId);
  //   const novelDoc = await getDoc(novelDocRef);

  //   if (!novelDoc.exists()) {
  //     console.error("Story not found");
  //     return null;
  //   }

  //   const novelData = novelDoc.data();
  //   const likes = novelData?.likes;
  //   const liked = likes?.includes(user.uid);

  //   return liked;
  // };

  const incrementLikes = async (storyId: string) => {
    const storyRef = doc(firestore, "novels", storyId);

    try {
      await updateDoc(storyRef, {
        likes: increment(1),
      });
    } catch (error) {
      console.error("Error liking novel: ", error);
    }
  };

  const fetchAllStories = async () => {
    try {
      // Reference to the novels collection in Firestore
      const novelsCollection = collection(firestore, "novels");

      // Fetch all documents in the novels collection
      const novelsSnapshot = await getDocs(novelsCollection);

      // Prepare an array to hold all stories
      const allStories: Story[] = [];

      // Iterate over each document in the snapshot
      for (const doc of novelsSnapshot.docs) {
        const novelData = doc.data();

        // Fetch chapters for each story
        const chaptersPath = novelData.chaptersPath;
        const chaptersRef = collection(firestore, chaptersPath);

        const chaptersSnapshot = await getDocs(chaptersRef);
        const chapters: Chapter[] = [];

        for (const chapterDoc of chaptersSnapshot.docs) {
          const chapterData = chapterDoc.data();
          const contentRef = ref(storage, chapterData.content);
          const contentUrl = await getDownloadURL(contentRef);
          const chapterContent = await fetch(contentUrl).then((res) =>
            res.text()
          );

          chapters.push({
            chapterId: chapterDoc.id,
            title: chapterData.title,
            content: chapterContent,
          });
        }

        // Add the story with its chapters to the array
        allStories.push({
          storyId: doc.id,
          title: novelData.title,
          chapters,
          author: novelData.author,
          lastUpdated: novelData.lastUpdated,
          views: novelData.views,
          likes: novelData.likes,
        });
      }

      // update state
      setStories(allStories);

      // Return the array of all stories
      return allStories;
    } catch (err) {
      console.error("Error fetching all stories:", err);
      return [];
    }
  };

  return (
    <EditorContext.Provider
      value={{
        incrementViewCount,
        drafts,
        fetchAllStories,
        title,
        setTitle,
        currentChapterTitle,
        setCurrentChapterTitle,
        currentChapters,
        setCurrentChapters,
        stories,
        setDrafts,
        setStories,
        editingStoryId,
        setEditingStoryId,
        editingChapterId,
        setEditingChapterId,
        clearCurrentStory,
        publishStory,
        publishLoading,
        fetchUserStories,
        userDrafts,
        deleteDraftById,
        fetchLoading,
        userStories,
        fetchStoryById,
        updateStoryById,
        deleteStoryById,
        saveDraft,
        fetchUserDrafts,
        fetchDraftById,
        updateDraftById,
        likes,
        incrementLikes,
        setsuggestion,
        suggestion,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditorContext must be used within an EditorProvider");
  }
  return context;
};
