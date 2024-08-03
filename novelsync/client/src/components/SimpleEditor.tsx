import "./style.css";
import { useEffect } from "react";
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

interface SimpleEditorProps {
  title: string;
  chapterName: string;
  content: string;
  setTitle: (title: string) => void;
  setChapterName: (chapterName: string) => void;
  setContent: (content: string) => void;
}

export function SimpleEditor({
  title,
  chapterName,
  content,
  setTitle,
  setChapterName,
  setContent,
}: SimpleEditorProps) {
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
    content,
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  }) as Editor;

  if (!editor) {
    return null;
  }

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="p-4 relative">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title here"
        className="w-full p-4 px-5 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        value={chapterName}
        onChange={(e) => setChapterName(e.target.value)}
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
    </div>
  );
}
