import "./style.css";
import { useEffect, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Image from "@tiptap/extension-image";
import CharacterCount from "@tiptap/extension-character-count";
import Heading from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";
import { Extension } from "@tiptap/core";

// Custom
import { generateLine } from "./gemin";
import EditorHeader from "./EditorHeader";
import { INovelWithChapters } from "../types/INovel";

interface IChapter {
  chapterName: string;
  content: string;
}

interface INovel {
  title: string;
  chapters: IChapter[];
}

interface SimpleEditorProps {
  novel: INovel;
  setNovel: (novel: INovelWithChapters) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  handlePublish: () => void;
}

export function SimpleEditor({
  novel,
  setNovel,
  isEditing,
  setIsEditing,
  handlePublish,
}: SimpleEditorProps) {
  const [currentChapter, setCurrentChapter] = useState<IChapter>({
    chapterName: "",
    content: "",
  });

  const LiteralTab = Extension.create({
    name: "literalTab",

    addKeyboardShortcuts() {
      return {
        Tab: () => {
          const editor = this.editor;
          const currentContent = editor.getText();

          (async () => {
            try {
              const generatedText = await generateLine(currentContent);
              if (generatedText) {
                editor.chain().focus().insertContent(generatedText).run();
              }
            } catch (error) {
              console.error("Error generating line:", error);
            }
          })();

          return true;
        },
      };
    },
  });

  const editor = useEditor({
    extensions: [
      Document,
      History,
      Paragraph,
      Text,
      Bold,
      Underline,
      Italic,
      Image,
      LiteralTab,
      CharacterCount.configure({
        limit: 500,
      }),
      Heading.configure({
        levels: [1, 2],
        HTMLAttributes: {
          "1": { class: "text-2xl font-bold" }, // Tailwind styles for H1
          "2": { class: "text-xl font-semibold" }, // Tailwind styles for H2
        },
      }),
    ],
    content: currentChapter.content,
    onUpdate({ editor }) {
      setCurrentChapter({ ...currentChapter, content: editor.getHTML() });
    },
  }) as Editor;

  if (!editor) {
    return null;
  }

  useEffect(() => {
    if (editor && currentChapter.content !== editor.getHTML()) {
      editor.commands.setContent(currentChapter.content);
    }
  }, [currentChapter.content, editor]);

  const handleAddChapter = () => {
    const updatedChapters = isEditing
      ? novel.chapters.map((chapter) =>
          chapter.chapterName === currentChapter.chapterName
            ? currentChapter
            : chapter
        )
      : [...novel.chapters, currentChapter];

    setNovel({
      ...novel,
      chapters: updatedChapters,
      id: "",
      chaptersPath: "",
      author: "",
      authorId: "",
      lastUpdated: "",
    });
    setCurrentChapter({ chapterName: "", content: "" });
    setIsEditing(false);
  };

  const handleChapterClick = (chapter: IChapter) => {
    setCurrentChapter(chapter);
    setIsEditing(true);
  };

  return (
    <div className="p-4 relative">
      <input
        type="text"
        value={novel.title}
        onChange={(e) =>
          setNovel({
            ...novel,
            title: e.target.value,
            id: "",
            chaptersPath: "",
            author: "",
            authorId: "",
            lastUpdated: "",
          })
        }
        placeholder="Enter title here"
        className="w-full p-4 px-5 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        value={currentChapter.chapterName}
        onChange={(e) =>
          setCurrentChapter({ ...currentChapter, chapterName: e.target.value })
        }
        placeholder="Enter Chapter here"
        className="mt-4 w-full p-4 px-5 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div
        onClick={() => editor.chain().focus().run()}
        className="h-96 max-w-none mt-4 p-4 border rounded-lg shadow-sm focus-within:shadow-md transition-shadow flex flex-col overflow-hidden resize-y"
      >
        <EditorContent
          className="flex-grow overflow-y-auto selection:bg-green-200 selection:text-green-900"
          editor={editor}
        />
      </div>
      <EditorHeader editor={editor} />

      <div>
        <div className="mb-4">
          {novel.chapters.map((chapter, index) => (
            <div
              key={index}
              className="mb-2 p-2 border rounded cursor-pointer"
              onClick={() => handleChapterClick(chapter)}
            >
              {chapter.chapterName}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center">
          <button
            onClick={handleAddChapter}
            className="bg-blue-500 m-2 w-40 text-white px-4 py-1 rounded"
          >
            {isEditing ? "Update Chapter" : "Add Chapter"}
          </button>
        </div>

        <button
          onClick={handlePublish}
          className="bg-blue-500 m-2 w-40 text-white px-4 py-1 rounded"
        >
          Publish
        </button>
      </div>
    </div>
  );
}
