import "./style.css";
import { useContext, useEffect, useRef, useState } from "react";
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
import { Plus, Edit3 } from "lucide-react";

import EditorHeader from "./EditorHeader";
import NovelsContext from "../contexts/NovelsContext";
import { useAI } from "../contexts/AIContext";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { IChapter } from "../types/INovel";

interface Chapter {
  id: string;
  title: string;
  content: string;
}

interface Story {
  id: string;
  title: string;
  chapters: Chapter[];
}
import { v4 as uuidv4 } from "uuid";

export function SimpleEditor() {
  const [title, setTitle] = useState<string>("");
  const [currentChapterTitle, setCurrentChapterTitle] = useState<string>("");
  const [currentChapters, setCurrentChapters] = useState<Chapter[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  const addChapter = () => {
    const content = editor.getHTML();
    const newChapter: Chapter = {
      id: uuidv4(),
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
        chapter.id === editingChapterId
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

  const addStory = () => {
    if (title && currentChapters.length > 0) {
      const newStory: Story = {
        id: uuidv4(),
        title,
        chapters: currentChapters,
      };
      setStories([...stories, newStory]);
      clearCurrentStory();
    } else {
      alert("Please enter a title and at least one chapter.");
    }
  };

  const editStory = () => {
    if (editingStoryId && title && currentChapters.length > 0) {
      const updatedStories = stories.map((story) =>
        story.id === editingStoryId
          ? { ...story, title, chapters: currentChapters }
          : story
      );
      setStories(updatedStories);
      clearCurrentStory();
    } else {
      alert("Please enter a title and at least one chapter.");
    }
  };

  const loadStoryForEditing = (story: Story) => {
    setTitle(story.title);
    setCurrentChapters(story.chapters);
    setEditingStoryId(story.id);
    if (story.chapters.length > 0) {
      loadChapterForEditing(story.chapters[0]);
    } else {
      editor.commands.clearContent();
    }
  };

  const loadChapterForEditing = (chapter: Chapter) => {
    editor.commands.setContent(chapter.content);
    setCurrentChapterTitle(chapter.title);
    setEditingChapterId(chapter.id);
  };

  const clearCurrentStory = () => {
    setTitle("");
    setCurrentChapters([]);
    setEditingStoryId(null);
    editor.commands.clearContent();
    setCurrentChapterTitle("");
    setEditingChapterId(null);
  };

  const handleDeleteChapter = (storyId: string, chapterId: string) => {
    setEditingStoryId(storyId);
    const updatedChapters = currentChapters.filter(
      (chapter) => chapter.id !== chapterId
    );
    console.log("Updated Chapters", updatedChapters);

    const updatedStories = stories.map((story) =>
      storyId === editingStoryId
        ? { ...story, title, chapters: updatedChapters }
        : story
    );
    console.log("Updated Stories", updatedStories);
    setStories(updatedStories);
    setCurrentChapters(updatedChapters);
    editor.commands.clearContent();
    setCurrentChapterTitle("");
    setEditingChapterId(null);
  };

  const novelsContext = useContext(NovelsContext);
  if (!novelsContext) {
    throw new Error("useNovels must be used within a NovelsProvider");
  }

  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    selectedNovel,
    setSelectedNovel,
    createLoading,
    suggestion,
    setsuggestion,
    createNovel,
  } = novelsContext;

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
              console.log(tabPressCount);
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
    content: selectedNovel.firstChapter.content,
  }) as Editor;

  const handlePublish = async () => {
    if (selectedNovel.chapters.length === 0) {
      alert("You need to add at least one chapter to publish the novel");
      return;
    }
    if (selectedNovel.title === "") {
      alert("You need to add a title to publish the novel");
      return;
    }
    if (selectedNovel.chapters[0].content === "") {
      alert("You think people like reading blank pages?");
      return;
    }
    if (selectedNovel.chapters.length > 0 && selectedNovel.title !== "") {
      const err = await createNovel({
        user,
        title: selectedNovel.title,
        chapters: selectedNovel.chapters,
      });
      if (err == "LIMIT_ERR") {
        alert(
          "You have reached the maximum limit of 10 novels (cuz we still testin)"
        );
      } else if (err == "MAX_NOVELS") {
        alert(
          "Wow didn't think this would be this popular max number of novels reached for now(cuz we still testin)"
        );
      } else if (err == "TOXIC_TITLE") {
        alert("Why are you like this? Please use a non-toxic title");
        setSelectedNovel({
          ...selectedNovel,
          title: "",
        });
      } else {
        navigate("/");
      }
    }
  };

  const saveDraft = async () => {
    console.log("Draft saved");
  };

  useEffect(() => {
    if (selectedAI) {
      aiGeneratorRef.current = selectedAI;
    }
    if (suggestion) {
      aiGenerator.generateFromSuggestion(suggestion).then((generatedText) => {
        editor.chain().focus().insertContent(generatedText).run();
      });
    }

    setsuggestion("");
  }, [selectedAI]);

  return (
    <div className="flex p-2 mt-4 overflow-auto w-full">
      <div className="w-[70%] p-4 bg-amber-50 rounded-lg shadow-lg overflow-y-auto">
        {createLoading && (
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

        <div className="flex mt-3">
          <EditorHeader editor={editor} />
        </div>
      </div>

      <div className="w-[30%] p-4 bg-white border border-gray-400 rounded shadow-lg">
        Dynamic Chapters and content
        <div>{currentChapterTitle}</div>
      </div>

      <div className="w-[30%] p-4 bg-white border border-gray-400 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Stories</h2>

        {stories.map((story) => (
          <div
            key={story.id}
            className="mb-4 p-2 rounded border border-gray-300"
          >
            <h3 className="text-lg font-semibold mb-2">{story.title}</h3>
            <ul className="list-disc list-inside">
              {story.chapters.map((chapter) => (
                <li
                  key={chapter.id}
                  className={`cursor-pointer hover:bg-gray-100 p-1 rounded flex justify-between items-center ${
                    selectedChapter === chapter.id ? "bg-blue-100" : ""
                  }`}
                  onClick={() => {
                    setSelectedChapter(chapter.id);
                    loadStoryForEditing(story);
                    loadChapterForEditing(chapter);
                  }}
                >
                  <span>{chapter.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChapter(story.id, chapter.id);
                    }}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {stories.length === 0 && <p>No stories created yet.</p>}
        <div className="mt-3">
          {editingChapterId ? (
            <button
              onClick={updateChapter}
              className="w-full p-2 mb-2 bg-yellow-500 text-white rounded flex items-center justify-center hover:bg-yellow-600"
            >
              <Edit3 className="mr-2" />
              Update Chapter
            </button>
          ) : (
            <button
              onClick={addChapter}
              className="w-full p-2 mb-2 bg-blue-500 text-white rounded flex items-center justify-center hover:bg-blue-600"
            >
              <Plus className="mr-2" />
              Add Chapter
            </button>
          )}

          {editingStoryId ? (
            <button
              onClick={editStory}
              className="w-full p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Update Story
            </button>
          ) : (
            <button
              onClick={addStory}
              className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Publish Story
            </button>
          )}
          <button
            onClick={saveDraft}
            className="w-full p-2 my-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Save Draft
          </button>
        </div>
      </div>
    </div>
  );
}
