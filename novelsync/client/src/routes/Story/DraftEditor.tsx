import "../../components/style.css";
import { useEffect, useRef } from "react";
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
import { AITextGenerator } from "../../components/AITextGenerator";

const limit = 5000;
import { Book, Trash2 } from "lucide-react";

import EditorHeader from "../../components/EditorHeader";

import { useAI } from "../../contexts/AIContext";
import { Loader } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

import { v4 as uuidv4 } from "uuid";
import { useEditorContext } from "../../contexts/EditorContext";
import { Chapter, Draft } from "../../types/IStory";

const DraftEditor = () => {
  const {
    title,
    setTitle,
    currentChapterTitle,
    setCurrentChapterTitle,
    currentChapters,
    setCurrentChapters,

    setDrafts,
    editingStoryId,
    setEditingStoryId,
    editingChapterId,
    setEditingChapterId,
    clearCurrentStory,
    publishStory,
    publishLoading,
    userDrafts,

    updateDraftById,
    fetchDraftById,
    suggestion,
    setsuggestion,
  } = useEditorContext();
  const { user } = useAuthContext();

  const addChapter = () => {
    const content = editor.getHTML();
    const newChapter = {
      chapterId: uuidv4(),
      title: currentChapterTitle,
      content,
    };
    setCurrentChapters([...currentChapters, newChapter]);
    editor.commands.clearContent();
    setCurrentChapterTitle("");
    setEditingChapterId(null);
  };

  const updateChapter = () => {
    if (editingChapterId) {
      const updatedChapters = currentChapters.map((chapter) =>
        chapter.chapterId === editingChapterId
          ? {
              ...chapter,
              title: currentChapterTitle,
              content: editor.getHTML(),
            }
          : chapter
      );
      setCurrentChapters(updatedChapters);
      editor.commands.clearContent();
      setCurrentChapterTitle("");
      setEditingChapterId(null);
    }
  };

  const deleteChapter = (chapterId: string) => {
    const updatedChapters = currentChapters.filter(
      (chapter) => chapter.chapterId !== chapterId
    );
    setCurrentChapters(updatedChapters);

    if (editingChapterId === chapterId) {
      editor.commands.clearContent();
      setCurrentChapterTitle("");
      setEditingChapterId(null);
    }
  };

  const addStory = () => {
    if (!user) return "Please login to create a story";
    if (title && currentChapters.length > 0) {
      const newStory = {
        storyId: uuidv4(),
        user,
        title,
        chapters: currentChapters,
      };
      try {
        publishStory(newStory);
      } catch (error) {
        console.log("Error publishing story", error);
      }
      clearCurrentStory();
    } else {
      alert("Please enter a title and at least one chapter.");
    }
  };

  const editDraft = () => {
    if (editingStoryId && title && currentChapters.length > 0) {
      const updatedDrafts = userDrafts.map((draft) =>
        draft.draftId === editingStoryId
          ? { ...draft, title, chapters: currentChapters }
          : draft
      );
      if (!user) return "Please login to update draft";

      updateDraftById({
        draftId: editingStoryId,
        user,
        newTitle: title,
        chapters: currentChapters,
      });
      setDrafts(updatedDrafts);
      // clearCurrentStory();
    } else {
      alert("Please enter a title and at least one chapter.");
    }
  };

  const loadDraftForEditing = async (draft: Draft) => {
    const s = await fetchDraftById(draft);

    if (!s) return;
    setTitle(s.title);
    setCurrentChapters(s.chapters);
    setEditingStoryId(s.draftId);
    if (s.chapters.length > 0) {
      loadChapterForEditing(s.chapters[0]);
    } else {
      editor.commands.clearContent();
    }
  };

  const loadChapterForEditing = (chapter: Chapter) => {
    editor.commands.setContent(chapter.content);
    setCurrentChapterTitle(chapter.title);
    setEditingChapterId(chapter.chapterId);
  };

  // const navigate = useNavigate();

  const { selectedAI } = useAI();
  const aiGeneratorRef = useRef<AITextGenerator | null>(null);

  const aiGenerator = new AITextGenerator(selectedAI?.id || 0);

  const LiteralTab = Extension.create({
    name: "literalTab",

    addOptions() {
      return {
        cooldown: 5000,
      };
    },

    addKeyboardShortcuts() {
      let isCooldown = false;
      let tabPressCount = 0;
      const maxTabPresses = 15;

      return {
        Tab: () => {
          if (isCooldown) {
            return false;
          }

          if (tabPressCount >= maxTabPresses) {
            alert("Chill out with the tab key, will ya?");
            return false;
          }

          const editor = this.editor;
          const currentContent = editor.getText();

          (async () => {
            isCooldown = true;
            setTimeout(() => {
              isCooldown = false;
            }, this.options.cooldown);

            try {
              if (tabPressCount < maxTabPresses) {
                const generatedText = aiGeneratorRef.current
                  ? await aiGeneratorRef.current.generateLine(currentContent)
                  : await aiGenerator.generateLine(currentContent);

                if (generatedText) {
                  editor.chain().focus().insertContent(generatedText).run();
                  tabPressCount += 1;
                }
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
    content: "",
  }) as Editor;

  const location = useLocation();

  useEffect(() => {
    if (location.state?.draft) {
      console.log("Loading draft for editing", location.state?.draft);
      loadDraftForEditing(location.state?.draft);
    }

    if (selectedAI) {
      aiGeneratorRef.current = selectedAI;
    }
    if (suggestion) {
      aiGenerator.generateFromSuggestion(suggestion).then((generatedText) => {
        editor.chain().focus().insertContent(generatedText).run();
      });
    }

    setsuggestion("");
  }, [selectedAI, user]);

  return (
    <div className="flex p-2 mt-4 justify-center overflow-auto w-full">
      {publishLoading && <div>Loading...</div>}
      <div className="w-[70%] p-4 bg-amber-50 rounded-lg shadow-lg overflow-y-auto">
        {publishLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
              <Loader className="animate-spin" size={24} />
              <span className="text-lg font-semibold">Publishing...</span>
            </div>
          </div>
        )}
        <h1 className="mb-4 text-3xl font-bold text-slate-800 italic">
          Summon your ultimate writing muse by pressing{" "}
          <span className="underline decoration-wavy text-blue-600">TAB</span>
        </h1>
        <div className="bg-white p-4 rounded-lg border border-gray-300">
          <input
            type="text"
            placeholder="Story Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-bold mb-6 p-2 focus:outline-none border-b-2 border-gray-200 focus:border-blue-500 transition-colors"
          />

          <input
            type="text"
            placeholder="Chapter Title"
            value={currentChapterTitle}
            onChange={(e) => setCurrentChapterTitle(e.target.value)}
            className="w-full text-2xl font-semibold mb-8 p-2 focus:outline-none border-b-2 border-gray-200 focus:border-blue-500 transition-colors"
          />

          <div className="min-h-[24rem] w-full flex justify-center">
            <EditorContent
              onClick={() => editor?.commands.focus()}
              className="w-full focus:outline-none bg-white selection:bg-blue-100"
              editor={editor}
            />
          </div>
        </div>

        <div className="flex my-3">
          <EditorHeader editor={editor} />
        </div>

        {editingChapterId ? (
          <button
            onClick={updateChapter}
            className="w-full p-2 mb-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Update Chapter
          </button>
        ) : (
          <button
            onClick={addChapter}
            className="w-full p-2 mb-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Chapter
          </button>
        )}

        <button
          onClick={editDraft}
          className="w-full mt-2 p-2 bg-slate-400 text-white rounded hover:bg-slate-500"
        >
          Update Draft
        </button>

        <button
          onClick={addStory}
          className="w-full p-2 mt-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Publish Story
        </button>
      </div>

      <div className="w-full md:w-1/4 p-6 bg-amber-50 rounded-lg shadow-lg ml-5">
        <h2 className="text-2xl font-bold mb-4 text-amber-800">
          {title || "Untitled Masterpiece"}
        </h2>

        {currentChapters.length === 0 ? (
          <p className="text-amber-700 italic">
            No chapters added yet. Start your journey!
          </p>
        ) : (
          <ul className="space-y-2">
            {currentChapters.map((chapter) => (
              <li
                key={chapter.chapterId}
                className="bg-white rounded-md shadow transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between p-3">
                  <div
                    className="flex items-center space-x-3 cursor-pointer"
                    onClick={() => loadChapterForEditing(chapter)}
                  >
                    <Book className="w-5 h-5 text-amber-600" />
                    <span className="font-medium text-amber-900">
                      {chapter.title}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteChapter(chapter.chapterId)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    aria-label="Delete chapter"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DraftEditor;
