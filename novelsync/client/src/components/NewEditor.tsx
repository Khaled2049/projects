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

interface Chapter {
  id: string;
  title: string;
  content: string;
}

const NewEditor: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

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
      debouncedSave();
    },
  });

  useEffect(() => {
    if (editor && currentChapter) {
      editor.commands.setContent(currentChapter.content);
    }
  }, [editor, currentChapter]);

  const handleSave = useCallback(() => {
    if (!editor || !chapterTitle) return;

    setSaveStatus("Saving...");
    const content = editor.getHTML();

    if (currentChapter) {
      // Update existing chapter
      setChapters(
        chapters.map((ch) =>
          ch.id === currentChapter.id
            ? { ...ch, title: chapterTitle, content }
            : ch
        )
      );
    } else {
      // Create new chapter
      const newChapter: Chapter = {
        id: Date.now().toString(),
        title: chapterTitle,
        content,
      };
      setChapters([...chapters, newChapter]);
      setCurrentChapter(newChapter);
    }

    setTimeout(() => {
      setSaveStatus("Saved");
      setTimeout(() => setSaveStatus(""), 2000);
    }, 1000);
  }, [editor, chapterTitle, currentChapter, chapters]);

  const debouncedSave = useCallback(debounce(handleSave, 2000), [handleSave]);

  const handleChapterSelect = (chapter: Chapter) => {
    setCurrentChapter(chapter);
    setChapterTitle(chapter.title);
    if (editor) {
      editor.commands.setContent(chapter.content);
    }
  };

  const handleNewChapter = () => {
    setCurrentChapter(null);
    setChapterTitle("");
    if (editor) {
      editor.commands.setContent("");
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 text-gray-200 p-4 flex">
      <div className="flex-grow max-w-4xl">
        <input
          type="text"
          value={chapterTitle}
          onChange={(e) => setChapterTitle(e.target.value)}
          placeholder="Chapter Title"
          className="w-full p-2 mb-4 bg-gray-800 border border-gray-700 rounded"
        />
        <EditorContent
          className="border border-gray-700 rounded-lg p-5 w-full min-h-[500px] bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          editor={editor}
        />
        <div className="mb-4 flex items-center justify-between mt-2">
          <button
            className="p-2 rounded bg-blue-600 hover:bg-blue-700 transition-colors"
            onClick={handleSave}
          >
            <span className="p-2">Publish</span>
          </button>
          <div className="text-sm text-gray-400">{saveStatus}</div>
        </div>
      </div>
      <div className="w-64 ml-4 bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Chapters</h2>
        <button
          className="w-full p-2 mb-4 bg-green-600 hover:bg-green-700 rounded transition-colors"
          onClick={handleNewChapter}
        >
          New Chapter
        </button>
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className={`p-2 mb-2 rounded cursor-pointer ${
              currentChapter?.id === chapter.id
                ? "bg-blue-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => handleChapterSelect(chapter)}
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

export default NewEditor;
