import React, { useState, useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import History from "@tiptap/extension-history";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Link from "@tiptap/extension-link";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import { storiesRepo, Story, StoryMetadata, Chapter } from "./StoriesRepo";
import { useAuthContext } from "../contexts/AuthContext";

const StoryEditor: React.FC = () => {
  const [stories, setStories] = useState<StoryMetadata[]>([]);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyDescription, setStoryDescription] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  const { user } = useAuthContext();
  const editor = useEditor({
    extensions: [
      Document,
      History,
      Paragraph,
      Text,
      Link.configure({ openOnClick: false }),
      Bold,
      Underline,
      Italic,
      Strike,
      Code,
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();

      debouncedSave(chapterTitle, content);
    },
  });

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    const storyList = await storiesRepo.getStoryList();
    setStories(storyList);
  };

  const loadStory = async (storyId: string) => {
    const story = await storiesRepo.getStory(storyId);

    if (story) {
      setCurrentStory(story);
      setStoryTitle(story.title);
      setStoryDescription(story.description);
      const storyChapters = await storiesRepo.getChapters(storyId);
      setChapters(storyChapters);
      if (storyChapters.length > 0) {
        setCurrentChapter(storyChapters[0]);
        setChapterTitle(storyChapters[0].title);
        editor?.commands.setContent(storyChapters[0].content);
      } else {
        setCurrentChapter(null);
        setChapterTitle("");
        editor?.commands.setContent("");
      }
    }
  };

  const handleSave = useCallback(
    async (chapterTitle: string, content: any) => {
      console.log("Saving...", currentStory, currentChapter, content);
      if (!currentStory) {
        console.error("No story selected");
        return;
      }
      setSaveStatus("Saving...");
      try {
        try {
          if (currentChapter) {
            // Update existing chapter
            console.log("Updating chapter");
            await storiesRepo.updateChapter(
              currentStory.id,
              currentChapter.id,
              chapterTitle,
              content
            );
          } else if (content.trim() !== "" || chapterTitle.trim() !== "") {
            console.log("Adding new chapter");
            const newChapterId = await storiesRepo.addChapter(
              currentStory.id,
              chapterTitle
            );
            await storiesRepo.updateChapter(
              currentStory.id,
              newChapterId,
              chapterTitle,
              content
            );
            const newChapter = await storiesRepo.getChapter(
              currentStory.id,
              newChapterId
            );
            if (newChapter) {
              setCurrentChapter(newChapter);
              setChapters([...chapters, newChapter]);
            }
          }

          await storiesRepo.updateStory(
            currentStory.id,
            storyTitle,
            storyDescription
          );

          setSaveStatus("Saved");
        } catch (error) {
          console.error("Error saving:", error);
          setSaveStatus(
            error instanceof Error ? error.message : "Error saving"
          );
        }
        setSaveStatus("Saved");
      } catch (error) {
        console.error("Error saving:", error);
        setSaveStatus(error instanceof Error ? error.message : "Error saving");
      }
      setTimeout(() => setSaveStatus(""), 2000);
    },
    [currentStory, currentChapter]
  );

  const debouncedSave = useCallback(
    debounce((chapterTitle, content: any) => {
      handleSave(chapterTitle, content);
    }, 2000),
    [handleSave]
  );

  const handleNewStory = async () => {
    if (user) {
      const newStoryId = await storiesRepo.createStory(
        "New Story",
        "",
        user.uid
      );
      await loadStories();
      await loadStory(newStoryId);
    } else {
      // Handle the case where the user is not authenticated
      console.error("User not authenticated");
    }
  };

  const handleNewChapter = async () => {
    if (!currentStory) return;
    const newChapterId = await storiesRepo.addChapter(
      currentStory.id,
      "New Chapter"
    );
    await loadStory(currentStory.id); // This will refresh the chapters list
    const newChapter = await storiesRepo.getChapter(
      currentStory.id,
      newChapterId
    );
    if (newChapter) {
      setCurrentChapter(newChapter);
      setChapterTitle(newChapter.title);
      editor?.commands.setContent(newChapter.content);
    }
  };

  const handlePublish = async () => {
    if (!currentStory) return;
    await storiesRepo.publishStory(currentStory.id);
    setSaveStatus("Published");
    setTimeout(() => setSaveStatus(""), 2000);
    loadStories();
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 text-gray-200 p-4 flex">
      {/* Stories list */}
      <div className="w-64 mr-4 bg-gray-800 p-4 rounded-lg overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Stories</h2>
        <button
          className="w-full p-2 mb-4 bg-green-600 hover:bg-green-700 rounded transition-colors"
          onClick={handleNewStory}
        >
          New Story
        </button>
        {stories.map((story) => (
          <div
            key={story.id}
            className={`p-2 mb-2 rounded cursor-pointer ${
              currentStory?.id === story.id
                ? "bg-blue-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => loadStory(story.id)}
          >
            {story.title}
            {story.isPublished && (
              <span className="ml-2 text-green-400">✓</span>
            )}
          </div>
        ))}
      </div>

      {/* Story editor */}
      <div className="flex-grow max-w-3xl mx-4">
        {currentStory ? (
          <>
            <input
              type="text"
              value={storyTitle}
              onChange={(e) => setStoryTitle(e.target.value)}
              placeholder="Story Title"
              className="w-full p-2 mb-2 bg-gray-800 border border-gray-700 rounded"
            />
            <textarea
              value={storyDescription}
              onChange={(e) => setStoryDescription(e.target.value)}
              placeholder="Story Description"
              className="w-full p-2 mb-4 bg-gray-800 border border-gray-700 rounded"
              rows={3}
            />

            <input
              type="text"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              placeholder="Chapter Title"
              className="w-full p-2 mb-4 bg-gray-800 border border-gray-700 rounded"
            />
            {editor && (
              <EditorContent
                className="border border-gray-700 rounded-lg p-5 w-full min-h-[500px] bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                editor={editor}
              />
            )}
            <div className="mt-2 flex items-center justify-between">
              <div className="text-sm text-gray-400">{saveStatus}</div>
            </div>
            <div className="flex justify-between mb-4">
              <button
                className="p-2 rounded bg-green-600 hover:bg-green-700 transition-colors"
                onClick={handlePublish}
                disabled={currentStory.isPublished}
              >
                {currentStory.isPublished ? "Published" : "Publish"}
              </button>
              <button
                className="p-2 rounded bg-green-600 hover:bg-green-700 transition-colors"
                onClick={() => handleSave(chapterTitle, editor?.getHTML())}
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 mt-10">
            Select a story or create a new one to start editing
          </div>
        )}
      </div>

      {/* Chapters list */}
      <div className="w-64 bg-gray-800 p-4 rounded-lg overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Chapters</h2>
        <div className="flex justify-center">
          <button
            className="p-2 rounded bg-blue-600 hover:bg-blue-700 transition-colors m-3"
            onClick={handleNewChapter}
          >
            New Chapter
          </button>
        </div>
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className={`p-2 mb-2 rounded cursor-pointer ${
              currentChapter?.id === chapter.id
                ? "bg-blue-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => {
              setCurrentChapter(chapter);
              setChapterTitle(chapter.title);
              editor?.commands.setContent(chapter.content);
            }}
          >
            {chapter.title}
          </div>
        ))}
      </div>
    </div>
  );
};

function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  let timeoutId: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}

export default StoryEditor;
