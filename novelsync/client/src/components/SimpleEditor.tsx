import "./style.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";

import History from "@tiptap/extension-history";
import { Extension } from "@tiptap/core";

import NovelsContext from "../contexts/NovelsContext";

// Custom
import { generateLine } from "./gemin";
import EditorHeader from "./EditorHeader";

interface SimpleEditorProps {
  oldTitle?: string;
  content?: string;
  edit?: boolean;
  novelId?: string;
}

export function SimpleEditor({
  oldTitle,
  content,
  edit,
  novelId,
}: SimpleEditorProps) {
  const [title, setTitle] = useState("");
  const { user } = useAuth();
  const novelsContext = useContext(NovelsContext);

  if (!novelsContext) {
    throw new Error("useNovels must be used within a NovelsProvider");
  }
  const {
    updateError,
    updateLoading,
    createError,
    createLoading,
    editNovelById,
    createNovel,
  } = novelsContext;

  const navigate = useNavigate();

  useEffect(() => {
    if (content) {
      editor.commands.setContent(content);
      setTitle(oldTitle || "");
    }
  }, [content]);

  const handleCreate = async (content: string) => {
    const novelId = await createNovel({ user, title, content });
    if (novelId) {
      console.log("Novel created:", novelId);
    }
    navigate("/home");
  };

  const handleUpdate = async (newContent: string) => {
    if (!novelId) return;
    console.log("Updating novel:", novelId);
    editNovelById({ id: novelId, title, newContent });
    navigate("/home");
  };

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
      LiteralTab,
    ],
  }) as Editor;

  if (!editor) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      <EditorHeader editor={editor} />
      <div className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title here"
          className="w-full p-4 px-5 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div
        onClick={() => editor.chain().focus().run()}
        className="h-96 max-w-none mt-4 p-4 border rounded-lg shadow-sm focus-within:shadow-md transition-shadow flex flex-col overflow-hidden resize-y"
      >
        <EditorContent
          className="flex-grow overflow-y-auto selection:bg-green-200 selection:text-green-900"
          editor={editor}
        />
      </div>

      {edit ? (
        <button
          onClick={() => handleUpdate(editor.getText())}
          disabled={updateLoading}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {updateError ? "Updating..." : "Update"}
        </button>
      ) : (
        <button
          onClick={() => handleCreate(editor.getText())}
          disabled={createLoading}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {createLoading ? "Creating..." : "Create"}
        </button>
      )}

      {createError && <p className="text-red-500 mt-2">{createError}</p>}
    </div>
  );
}
