import "./style.css";
import { useContext, useEffect } from "react";
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
import NovelsContext from "../contexts/NovelsContext";

export function SimpleEditor() {
  const novelsContext = useContext(NovelsContext);
  if (!novelsContext) {
    throw new Error("useNovels must be used within a NovelsProvider");
  }
  const { selectedNovel, setSelectedNovel } = novelsContext;

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
          "1": { class: "text-3xl font-bold mb-4" },
          "2": { class: "text-2xl font-semibold mb-3" },
        },
      }),
    ],
    content: selectedNovel.firstChapter.content,
    onUpdate({ editor }) {
      setSelectedNovel({
        ...selectedNovel,
        firstChapter: {
          ...selectedNovel.firstChapter,
          content: editor.getHTML(),
        },
      });
    },
  }) as Editor;

  useEffect(() => {
    if (editor && selectedNovel.firstChapter.content !== editor.getHTML()) {
      editor.commands.setContent(selectedNovel.firstChapter.content);
    }
  }, [selectedNovel.firstChapter.content, editor]);

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
        <input
          type="text"
          value={selectedNovel.title}
          onChange={(e) =>
            setSelectedNovel({
              ...selectedNovel,
              title: e.target.value,
            })
          }
          placeholder="Enter title here"
          className="w-full text-3xl font-bold mb-6 p-2 focus:outline-none border-b-2 border-gray-200 focus:border-blue-500 transition-colors"
        />

        <input
          type="text"
          value={selectedNovel.firstChapter.chapterName}
          onChange={(e) =>
            setSelectedNovel({
              ...selectedNovel,
              firstChapter: {
                ...selectedNovel.firstChapter,
                chapterName: e.target.value,
              },
            })
          }
          placeholder="Enter Chapter here"
          className="w-full text-2xl font-semibold mb-8 p-2 focus:outline-none border-b-2 border-gray-200 focus:border-blue-500 transition-colors"
        />

        <div
          onClick={() => editor.chain().focus().run()}
          className="min-h-[24rem] max-w-none focus-within:shadow-lg transition-shadow"
        >
          <EditorContent
            className="prose max-w-none focus:outline-none selection:bg-blue-100"
            editor={editor}
          />
        </div>
      </div>
      <div className="mt-4">
        <EditorHeader editor={editor} />
      </div>
    </div>
  );
}
