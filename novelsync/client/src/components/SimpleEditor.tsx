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
import Image from "@tiptap/extension-image";

import History from "@tiptap/extension-history";
import { Extension } from "@tiptap/core";

import NovelsContext from "../contexts/NovelsContext";

// Custom
import { generateLine } from "./gemin";
import EditorHeader from "./EditorHeader";
import DigitalTimer from "./Timer";

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
    updateNovelById,
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
    updateNovelById({ id: novelId, title, newContent });
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
      Image,
      LiteralTab,
    ],
  }) as Editor;

  if (!editor) {
    return null;
  }

  return (
    <div className=" mx-auto p-4 relative">
      <div className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title here"
          className="w-full p-4 px-5 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex">
        <div className="w-2/3 pr-4">
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
              onClick={() => handleUpdate(editor.getHTML())}
              disabled={updateLoading}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {updateError ? "Updating..." : "Update"}
            </button>
          ) : (
            <button
              onClick={() => handleCreate(editor.getHTML())}
              disabled={createLoading}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {createLoading ? "Creating..." : "Create"}
            </button>
          )}

          {createError && <p className="text-red-500 mt-2">{createError}</p>}
          <EditorHeader editor={editor} />
        </div>

        <div className="w-1/3 px-4 ">
          <h2 className="text-lg font-bold mb-4">Suggestions</h2>
          <div className="grid grid-cols-1 gap-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow-md hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => {
                  console.log("clicked");
                }}
              >
                <h3 className="text-md font-semibold">
                  Suggestion {index + 1}
                </h3>
                <p className="text-sm text-gray-600">
                  Description for suggestion {index + 1}.
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/3 pl-4 ">
          <h2 className="text-lg font-bold mb-4">Set Goals</h2>
          <DigitalTimer />
          <div className="mb-6">
            <h3 className="text-md font-semibold"></h3>
            <p className="text-sm text-gray-600">
              Get tailored writing suggestions based on your goals and audience.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-md font-semibold">Genre</h3>
            <div className="space-y-2">
              <label className="block">
                <input
                  type="radio"
                  name="domain"
                  value="academic"
                  className="mr-2"
                />{" "}
                Academic
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="domain"
                  value="business"
                  className="mr-2"
                />{" "}
                Business
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="domain"
                  value="general"
                  className="mr-2"
                />{" "}
                General
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="domain"
                  value="email"
                  className="mr-2"
                />{" "}
                Email
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="domain"
                  value="casual"
                  className="mr-2"
                />{" "}
                Casual
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="domain"
                  value="creative"
                  className="mr-2"
                />{" "}
                Creative
              </label>
              <p className="text-sm text-gray-600 mt-2">
                Get customized suggestions for business writing, academic
                assignments, and more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
