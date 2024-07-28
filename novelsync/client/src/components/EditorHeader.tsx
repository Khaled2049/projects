import { useCallback } from "react";
import * as Icons from "./Icons";
import { Editor } from "@tiptap/react";

interface EditorHeaderProps {
  editor: Editor;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ editor }) => {
  const toggleBold = useCallback(() => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
  }, [editor]);

  return (
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
    </div>
  );
};

export default EditorHeader;
