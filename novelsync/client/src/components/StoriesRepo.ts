import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "../config/firebase";

export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
  wordCount: number;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  chapterCount: number;
}

export interface StoryMetadata {
  id: string;
  title: string;
  description: string;
  chapterCount: number;
  isPublished: boolean;
  updatedAt: Date;
}

const WORD_LIMIT = 5000;

class StoriesRepo {
  private storiesCollection = collection(firestore, "stories");

  async getStoryList(): Promise<StoryMetadata[]> {
    const q = query(this.storiesCollection, orderBy("updatedAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        chapterCount: data.chapterCount,
        isPublished: data.isPublished,
        updatedAt: data.updatedAt.toDate(),
      };
    });
  }

  async getStory(storyId: string): Promise<Story | null> {
    try {
      const storyRef = doc(this.storiesCollection, storyId);
      const storySnap = await getDoc(storyRef);
      if (storySnap.exists()) {
        const data = storySnap.data();
        return {
          id: storySnap.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Story;
      }
    } catch (error) {
      console.error("Error getting story:", error);
    }
    return null;
  }

  async createStory(
    title: string,
    description: string,
    ownerId: string
  ): Promise<string> {
    const newStoryRef = doc(this.storiesCollection);
    const newStory: Story = {
      id: newStoryRef.id,
      title,
      description,
      ownerId,
      isPublished: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      chapterCount: 0,
    };
    await setDoc(newStoryRef, newStory);
    return newStoryRef.id;
  }

  async updateStory(
    storyId: string,
    title: string,
    description: string
  ): Promise<void> {
    try {
      const storyRef = doc(this.storiesCollection, storyId);
      await updateDoc(storyRef, {
        title,
        description,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating story:", error);
      throw error;
    }
  }

  async addChapter(storyId: string, chapterTitle: string): Promise<string> {
    try {
      const storyRef = doc(this.storiesCollection, storyId);
      const chaptersCollection = collection(storyRef, "chapters");

      const story = await this.getStory(storyId);
      if (!story) throw new Error("Story not found");

      const newChapterRef = doc(chaptersCollection);
      const newChapter: Chapter = {
        id: newChapterRef.id,
        title: chapterTitle,
        content: "",
        order: story.chapterCount,
        wordCount: 0,
      };

      await setDoc(newChapterRef, newChapter);

      // Update the story's chapter count
      await updateDoc(storyRef, {
        chapterCount: story.chapterCount + 1,
        updatedAt: new Date(),
      });

      return newChapter.id;
    } catch (error) {
      console.error("Error adding chapter:", error);
      throw error;
    }
  }

  async getChapters(storyId: string): Promise<Chapter[]> {
    try {
      const chaptersCollection = collection(
        doc(this.storiesCollection, storyId),
        "chapters"
      );
      const q = query(chaptersCollection, orderBy("order"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Chapter)
      );
    } catch (error) {
      console.error("Error getting chapters:", error);
    }
    return [];
  }

  async getChapter(
    storyId: string,
    chapterId: string
  ): Promise<Chapter | null> {
    const chapterRef = doc(
      this.storiesCollection,
      storyId,
      "chapters",
      chapterId
    );
    const chapterSnap = await getDoc(chapterRef);
    if (chapterSnap.exists()) {
      return { id: chapterSnap.id, ...chapterSnap.data() } as Chapter;
    }
    return null;
  }

  async updateChapter(
    storyId: string,
    chapterId: string,
    title: string,
    content: string
  ): Promise<void> {
    try {
      console.log("Updating chapter", storyId, chapterId);
      const chapterRef = doc(
        this.storiesCollection,
        storyId,
        "chapters",
        chapterId
      );
      const wordCount = this.countWords(content);
      if (wordCount > WORD_LIMIT) {
        throw new Error(
          `Chapter exceeds ${WORD_LIMIT} word limit. Current word count: ${wordCount}`
        );
      }

      await updateDoc(chapterRef, {
        title,
        content,
        wordCount,
      });

      // Update the story's updatedAt field
      await updateDoc(doc(this.storiesCollection, storyId), {
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating chapter:", error);
      throw error;
    }
  }

  async deleteChapter(storyId: string, chapterId: string): Promise<void> {
    const chapterRef = doc(
      this.storiesCollection,
      storyId,
      "chapters",
      chapterId
    );
    await deleteDoc(chapterRef);

    // Update the story's chapter count and updatedAt field
    const storyRef = doc(this.storiesCollection, storyId);
    const story = await this.getStory(storyId);
    if (story) {
      await updateDoc(storyRef, {
        chapterCount: story.chapterCount - 1,
        updatedAt: new Date(),
      });
    }
  }

  async publishStory(storyId: string): Promise<void> {
    const storyRef = doc(this.storiesCollection, storyId);
    await updateDoc(storyRef, {
      isPublished: true,
      updatedAt: new Date(),
    });
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).length;
  }

  getWordLimit(): number {
    return WORD_LIMIT;
  }
}

export const storiesRepo = new StoriesRepo();