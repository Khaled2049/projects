import { useCallback, useState } from "react";
import "./style.css";
// => Tiptap packages
import { useEditor, EditorContent, Editor, BubbleMenu } from "@tiptap/react";
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
import { Extension } from "@tiptap/core";

// Custom
import * as Icons from "./Icons";
import { LinkModal } from "./LinkModal";
import { GoogleGenerativeAI } from "@google/generative-ai";

export function SimpleEditor() {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const history = [
    {
      role: "user",
      parts: [
        {
          text: "You are a veteran author and will help me write a novel. You will read my previous sentences and generate a new sentence to guide the story",
        },
      ],
    },
  ];

  const chat = model.startChat({
    history,
    generationConfig: {
      maxOutputTokens: 100,
    },
  });

  async function generateLine(prevText: string) {
    history.push({ role: "user", parts: [{ text: prevText }] });

    console.log("prevText:", prevText);

    try {
      const result = await chat.sendMessageStream(prevText);

      let generatedText = " ";
      for await (const chunk of result.stream) {
        const chunkText = await chunk.text();
        generatedText += chunkText; // Accumulate generated text
      }

      history.push({ role: "model", parts: [{ text: generatedText }] });

      return generatedText;
    } catch (error) {
      console.error("Error:", error);
    }
  }

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

          // Prevent default tab behavior
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
      Link.configure({
        openOnClick: false,
      }),
      Bold,
      Underline,
      Italic,
      Strike,
      Code,
      LiteralTab,
    ],
  }) as Editor;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState<string>("");

  const openModal = useCallback(() => {
    console.log(editor.chain().focus());
    setUrl(editor.getAttributes("link").href);
    setIsOpen(true);
  }, [editor]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setUrl("");
  }, []);

  const saveLink = useCallback(() => {
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url, target: "_blank" })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    closeModal();
  }, [editor, url, closeModal]);

  const removeLink = useCallback(() => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    closeModal();
  }, [editor, closeModal]);

  const toggleBold = useCallback(() => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleCode = useCallback(() => {
    editor.chain().focus().toggleCode().run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-100 rounded-lg">
        <button
          className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Icons.RotateLeft />
        </button>
        <button
          className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Icons.RotateRight />
        </button>
        <button
          className="p-2 rounded-md hover:bg-gray-200 transition-colors"
          onClick={openModal}
        >
          <Icons.Link />
        </button>
        <button
          className={`p-2 rounded-md hover:bg-gray-200 transition-colors ${
            editor.isActive("bold") ? "bg-gray-300" : ""
          }`}
          onClick={toggleBold}
        >
          <Icons.Bold />
        </button>
        <button
          className={`p-2 rounded-md hover:bg-gray-200 transition-colors ${
            editor.isActive("underline") ? "bg-gray-300" : ""
          }`}
          onClick={toggleUnderline}
        >
          <Icons.Underline />
        </button>
        <button
          className={`p-2 rounded-md hover:bg-gray-200 transition-colors ${
            editor.isActive("underline") ? "bg-gray-300" : ""
          }`}
          onClick={toggleItalic}
        >
          <Icons.Italic />
        </button>
        <button
          className={`p-2 rounded-md hover:bg-gray-200 transition-colors ${
            editor.isActive("underline") ? "bg-gray-300" : ""
          }`}
          onClick={toggleStrike}
        >
          <Icons.Strikethrough />
        </button>
        <button
          className={`p-2 rounded-md hover:bg-gray-200 transition-colors ${
            editor.isActive("underline") ? "bg-gray-300" : ""
          }`}
          onClick={toggleCode}
        >
          <Icons.Code />
        </button>
      </div>

      <BubbleMenu
        className="flex bg-white border rounded-md shadow-lg"
        tippyOptions={{ duration: 150 }}
        editor={editor}
        shouldShow={({ editor, view, state, oldState, from, to }) => {
          // only show the bubble menu for links.
          return from === to && editor.isActive("link");
        }}
      >
        <button
          className="px-3 py-1 text-blue-600 hover:bg-blue-100 transition-colors"
          onClick={openModal}
        >
          Edit
        </button>
        <button
          className="px-3 py-1 text-red-600 hover:bg-red-100 transition-colors"
          onClick={removeLink}
        >
          Remove
        </button>
      </BubbleMenu>

      <div className="h-96 max-w-none mt-4 p-4 border rounded-lg shadow-sm focus-within:shadow-md transition-shadow flex flex-col overflow-hidden resize-y">
        <EditorContent
          className="flex-grow overflow-y-auto selection:bg-green-200 selection:text-green-900"
          editor={editor}
        />
      </div>

      <LinkModal
        url={url}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Link Modal"
        closeModal={closeModal}
        onChangeUrl={(e) => setUrl(e.target.value)}
        onSaveLink={saveLink}
        onRemoveLink={removeLink}
      />
    </div>
  );
}
