import { useCallback, useState } from "react";
import * as Icons from "./Icons";
import { Editor } from "@tiptap/react";
import { LinkModal } from "./LinkModal";
import axiosInstance from "../api";
import { RiAiGenerate } from "react-icons/ri";
interface EditorHeaderProps {
  editor: Editor;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ editor }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [genImage, setGenImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = async (prompt: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/generate", { prompt });
      const imageData = response.data.image;
      editor
        .chain()
        .focus()
        .setImage({ src: `data:image/png;base64,${imageData}` })
        .run();
      // Handle the response data as needed
    } catch (error) {
      console.error("Error generating text:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBold = useCallback(() => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
  }, [editor]);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, [editor]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setGenImage("");
  }, []);

  const saveLink = useCallback(async () => {
    // Generate image if a prompt is provided
    if (genImage) {
      console.log("genImage before calling func", genImage);
      await generateImage(genImage);
    }

    editor.commands.blur();
    closeModal();
  }, [editor, genImage, closeModal]);

  const removeLink = useCallback(() => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    closeModal();
  }, [editor, closeModal]);

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

      <button
        onClick={openModal}
        className="p-2 rounded-md hover:bg-gray-200 transition-colors relative"
        disabled={isLoading}
      >
        {isLoading ? <h1>Loading...</h1> : <RiAiGenerate />}
      </button>

      <LinkModal
        url={genImage}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Enter Prompt Modal"
        closeModal={closeModal}
        onChangeUrl={(e) => setGenImage(e.target.value)}
        onSaveLink={saveLink}
        onRemoveLink={removeLink}
      />
    </div>
  );
};

export default EditorHeader;
