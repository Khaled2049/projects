import { useEditor, EditorContent, Editor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Link from "@tiptap/extension-link";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import { v4 as uuidv4 } from "uuid";
import { useEditorContext } from "../contexts/EditorContext";
import { Story, Chapter } from "../types/IStory";
import { useState } from "react";

export function SimpleEditor() {
  const [isEditing, setIsEditing] = useState(false);

  const {
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
  } = useEditorContext();

  const editor = useEditor({
    extensions: [
      Document,
      History,
      Paragraph,
      Text,
      Link.configure({
        openOnClick: false,
      }),
      Bold,
      Underline,
      Italic,
      Strike,
      Code,
    ],
    content: "",
  }) as Editor;

  const addChapter = () => {
    const content = editor.getHTML();
    const newChapter = {
      id: uuidv4(),
      title: currentChapterTitle,
      content,
    };
    setCurrentChapters([...currentChapters, newChapter]);
    editor.commands.clearContent();
    setCurrentChapterTitle("");
    setEditingChapterId(null);
  };

  const updateChapter = () => {
    if (editingChapterId) {
      const updatedChapters = currentChapters.map((chapter) =>
        chapter.id === editingChapterId
          ? {
              ...chapter,
              title: currentChapterTitle,
              content: editor.getHTML(),
            }
          : chapter
      );
      setCurrentChapters(updatedChapters);
      editor.commands.clearContent();
      setCurrentChapterTitle("");
      setEditingChapterId(null);
    }
  };

  const deleteChapter = (chapterId: string) => {
    const updatedChapters = currentChapters.filter(
      (chapter) => chapter.id !== chapterId
    );
    setCurrentChapters(updatedChapters);

    if (editingChapterId === chapterId) {
      editor.commands.clearContent();
      setCurrentChapterTitle("");
      setEditingChapterId(null);
    }
  };

  const addStory = () => {
    if (title && currentChapters.length > 0) {
      const newStory = {
        id: uuidv4(),
        title,
        chapters: currentChapters,
      };
      setStories([...stories, newStory]);
      clearCurrentStory();
    } else {
      alert("Please enter a title and at least one chapter.");
    }
  };

  const editStory = () => {
    if (editingStoryId && title && currentChapters.length > 0) {
      const updatedStories = stories.map((story) =>
        story.id === editingStoryId
          ? { ...story, title, chapters: currentChapters }
          : story
      );
      setStories(updatedStories);
      clearCurrentStory();
    } else {
      alert("Please enter a title and at least one chapter.");
    }
  };

  const loadStoryForEditing = (story: Story) => {
    setTitle(story.title);
    setCurrentChapters(story.chapters);
    setEditingStoryId(story.id);
    setIsEditing(true);
    if (story.chapters.length > 0) {
      loadChapterForEditing(story.chapters[0]);
    } else {
      editor.commands.clearContent();
    }
  };

  const loadChapterForEditing = (chapter: Chapter) => {
    editor.commands.setContent(chapter.content);
    setCurrentChapterTitle(chapter.title);
    setEditingChapterId(chapter.id);
  };

  return (
    <div className="flex flex-row min-h-screen bg-gray-200 p-4">
      <div className="w-1/2 p-4">
        <input
          type="text"
          placeholder="Story Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-400 rounded"
        />

        <input
          type="text"
          placeholder="Chapter Title"
          value={currentChapterTitle}
          onChange={(e) => setCurrentChapterTitle(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-400 rounded"
        />

        <EditorContent
          editor={editor}
          className="prose prose-lg border border-gray-400 rounded p-4 bg-white text-gray-800 h-64 overflow-y-scroll shadow-lg mb-4"
        />

        {editingChapterId ? (
          <button
            onClick={updateChapter}
            className="w-full p-2 mb-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Update Chapter
          </button>
        ) : (
          <button
            onClick={addChapter}
            className="w-full p-2 mb-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Chapter
          </button>
        )}

        {editingStoryId ? (
          <button
            onClick={editStory}
            className="w-full p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Update story
          </button>
        ) : (
          <button
            onClick={addStory}
            className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Publish new Story
          </button>
        )}
      </div>

      <div className="w-[20%] p-4 bg-white border border-gray-400 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Stories</h2>
        {stories.length === 0 && <p>No stories added yet.</p>}
        {stories.map((story) => (
          <div>
            <h2 className="text-xl font-semibold mb-4">{story.title}</h2>
            {story.chapters.map((chapter) => (
              <li
                key={chapter.id}
                className={`cursor-pointer p-1 rounded ${
                  isEditing
                    ? "hover:bg-gray-100"
                    : "text-gray-400 cursor-not-allowed"
                }`}
                onClick={() => isEditing && loadChapterForEditing(chapter)}
              >
                <strong>{chapter.title}</strong>
              </li>
            ))}
            <button
              onClick={() => loadStoryForEditing(story)}
              className="w-full p-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit Story
            </button>
          </div>
        ))}
      </div>

      <div className="w-1/2 p-4 bg-white border border-gray-400 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Current Story</h2>
        <h3 className="text-lg font-semibold mb-2">
          {title || "No title yet"}
        </h3>
        <ul className="list-disc list-inside">
          {currentChapters.map((chapter) => (
            <li
              key={chapter.id}
              className="cursor-pointer hover:bg-gray-100 p-1 rounded flex justify-between items-center"
            >
              <div onClick={() => loadChapterForEditing(chapter)}>
                <strong>{chapter.title}</strong>
              </div>
              <button
                onClick={() => deleteChapter(chapter.id)}
                className="ml-4 p-1 text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        {currentChapters.length === 0 && <p>No chapters added yet.</p>}
      </div>
    </div>
  );
}
