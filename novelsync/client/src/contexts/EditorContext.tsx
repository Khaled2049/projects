import { createContext, useState, useContext, ReactNode } from "react";
import { Chapter, Story } from "../types/IStory";

interface EditorContextType {
  title: string;
  setTitle: (title: string) => void;
  currentChapterTitle: string;
  setCurrentChapterTitle: (title: string) => void;
  currentChapters: Chapter[];
  setCurrentChapters: (chapters: Chapter[]) => void;
  stories: Story[];
  setStories: (stories: Story[]) => void;
  editingStoryId: string | null;
  setEditingStoryId: (id: string | null) => void;
  editingChapterId: string | null;
  setEditingChapterId: (id: string | null) => void;
  clearCurrentStory: () => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
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
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);

  return (
    <EditorContext.Provider
      value={{
        title,
        setTitle,
        currentChapterTitle,
        setCurrentChapterTitle,
        currentChapters,
        setCurrentChapters,
        stories,
        setStories,
        editingStoryId,
        setEditingStoryId,
        editingChapterId,
        setEditingChapterId,
        clearCurrentStory,
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
