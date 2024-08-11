import "./style.css";
import { useContext, useEffect, useRef } from "react";
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
import Placeholder from "@tiptap/extension-placeholder";
import { Extension } from "@tiptap/core";
import { AITextGenerator } from "./gemin";

const limit = 5000;

// Custom
import EditorHeader from "./EditorHeader";
import NovelsContext from "../contexts/NovelsContext";
import { useAI } from "../contexts/AIContext";

export function SimpleEditor() {
  const novelsContext = useContext(NovelsContext);
  if (!novelsContext) {
    throw new Error("useNovels must be used within a NovelsProvider");
  }

  const { selectedNovel, setSelectedNovel, suggestion, setsuggestion } =
    novelsContext;

  const { selectedAI } = useAI();
  const aiGeneratorRef = useRef<AITextGenerator | null>(null);

  const aiGenerator = new AITextGenerator(selectedAI?.id || 0);

  const LiteralTab = Extension.create({
    name: "literalTab",

    addKeyboardShortcuts() {
      return {
        Tab: () => {
          const editor = this.editor;
          const currentContent = editor.getText();

          (async () => {
            if (aiGeneratorRef.current) {
              let aitest = aiGeneratorRef.current;
              const generatedText = await aitest.generateLine(currentContent);
              if (generatedText) {
                editor.chain().focus().insertContent(generatedText).run();
              }
            } else {
              try {
                const generatedText = await aiGenerator.generateLine(
                  currentContent
                );
                if (generatedText) {
                  editor.chain().focus().insertContent(generatedText).run();
                }
              } catch (error) {
                console.error("Error generating line:", error);
              }
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
        limit,
      }),
      Heading.configure({
        levels: [1, 2],
        HTMLAttributes: {
          "1": { class: "text-3xl font-bold mb-4" },
          "2": { class: "text-2xl font-semibold mb-3" },
        },
      }),
      Placeholder.configure({
        placeholder: "Write something already ya silly goose…",
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
    if (selectedAI) {
      aiGeneratorRef.current = selectedAI;
    }
  }, [selectedAI]);

  useEffect(() => {
    if (editor && selectedNovel.firstChapter.content !== editor.getHTML()) {
      editor.commands.setContent(selectedNovel.firstChapter.content);
      if (suggestion) {
        aiGenerator.generateFromSuggestion(suggestion).then((generatedText) => {
          editor.chain().focus().insertContent(generatedText).run();
        });
      }
      setsuggestion("");
    }
  }, [selectedNovel.firstChapter.content, editor]);

  return (
    <div>
      <div className="flex flex-col items-center bg-amber-50 rounded-lg shadow-lg max-h-[46rem] overflow-y-auto p-4 border border-amber-200">
        <div className="w-[55rem] mx-auto p-2 bg-amber-50 rounded-lg">
          <input
            type="text"
            value={selectedNovel.title}
            onChange={(e) =>
              setSelectedNovel({
                ...selectedNovel,
                title: e.target.value,
              })
            }
            placeholder="Title"
            className="w-full text-3xl font-bold mb-6 p-2 focus:outline-none border-b-2 border-gray-200 bg-amber-50 focus:border-blue-500 transition-colors"
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
            placeholder="Chapter"
            className="w-full text-2xl font-semibold mb-8 p-2 focus:outline-none border-b-2 border-gray-200 bg-amber-50 focus:border-blue-500 transition-colors"
          />
          <div className="min-h-[24rem] w-full flex bg-amber-50 justify-center">
            <EditorContent
              onClick={() => editor?.commands.focus()}
              className="w-full focus:outline-none bg-amber-50 selection:bg-blue-100"
              editor={editor}
            />
          </div>
        </div>
      </div>
      <div className="flex mt-3">
        <EditorHeader editor={editor} />
      </div>
    </div>
  );
}
