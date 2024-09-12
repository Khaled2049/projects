import "./style.css";
import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, Editor, BubbleMenu } from "@tiptap/react";
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
import BulletList from "@tiptap/extension-bullet-list";
import { Extension } from "@tiptap/core";
import { AITextGenerator } from "./AITextGenerator";
import ListItem from "@tiptap/extension-list-item";

const limit = 5000;
import { Book, Trash2 } from "lucide-react";

import EditorHeader from "./EditorHeader";
import { useAI } from "../contexts/AIContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

import { v4 as uuidv4 } from "uuid";
import { useEditorContext } from "../contexts/EditorContext";
import { Chapter, Draft, Story } from "../types/IStory";
import AIPartners from "./AIPartners";
import AITools from "./AITools";

export function SimpleEditor() {
  const [_isEditing, setIsEditing] = useState(false);
  const [rightColumnVisible, setRightColumnVisible] = useState(true);
  const [aitoolsVisible, setAitoolsVisible] = useState(true);
  const [savingMessage, setSavingMessage] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [updateMsg, setUpdateMsg] = useState(false);

  const navigate = useNavigate();

  const { user } = useAuthContext();
  const {
    title,
    setTitle,
    currentChapterTitle,
    setCurrentChapterTitle,
    currentChapters,
    setCurrentChapters,
    fetchStoryById,
    setStories,
    editingStoryId,
    setEditingStoryId,
    editingChapterId,
    setEditingChapterId,
    clearCurrentStory,
    publishStory,
    publishLoading,
    userStories,
    updateStoryById,
    saveDraft,
    userDrafts,
    updateDraftById,
    fetchDraftById,
    setDrafts,
    suggestion,
    setsuggestion,
  } = useEditorContext();
  const { selectedAI } = useAI();
  const location = useLocation();

  const aiGeneratorRef = useRef<AITextGenerator | null>(null);

  const aiGenerator = new AITextGenerator(selectedAI?.id || 0);

  useEffect(() => {
    clearCurrentStory();
    if (location.state?.draft) {
      loadDraftForEditing(location.state?.draft);
    } else if (location.state?.story) {
      loadStoryForEditing(location.state?.story);
    } else if (location.state?.newDraft) {
      const { title, chapters, draftId } = location.state?.newDraft;
      setTitle(title);
      setCurrentChapters(chapters);
      setEditingStoryId(draftId);
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

  const addDraft = async () => {
    if (!user) return "Please login to save a draft";
    if (title && currentChapters.length > 0) {
      const newDraft = {
        draftId: uuidv4(),
        user,
        title,
        chapters: currentChapters,
      };

      setSavingMessage("Saving...");

      try {
        await saveDraft(newDraft);
        setSavingMessage("Saved!");
        setTimeout(() => {
          setSavingMessage(""); // Clear the message after 3 seconds
        }, 3000);
      } catch (error) {
        console.log("Error publishing draft", error);
        setSavingMessage("Failed to save draft.");
        setTimeout(() => {
          setSavingMessage(""); // Clear the message after 3 seconds
        }, 3000);
      }
    } else {
      alert("Please enter a title and at least one chapter.");
    }
    navigate("/user-stories");
  };

  const editStory = () => {
    if (editingStoryId && title && currentChapters.length > 0) {
      const updatedStories = userStories.map((story) =>
        story.storyId === editingStoryId
          ? { ...story, title, chapters: currentChapters }
          : story
      );
      if (!user) return "Please login to update a story";

      updateStoryById({
        storyId: editingStoryId,
        user,
        newTitle: title,
        chapters: currentChapters,
      });
      setStories(updatedStories);
      clearCurrentStory();
    } else {
      alert("Please enter a title and at least one chapter.");
    }
  };

  const editDraft = async () => {
    if (editingStoryId && title && currentChapters.length > 0) {
      const updatedDrafts = userDrafts.map((draft) =>
        draft.draftId === editingStoryId
          ? { ...draft, title, chapters: currentChapters }
          : draft
      );
      if (!user) return "Please login to update draft";

      setUpdateMsg(true);
      try {
        await updateDraftById({
          draftId: editingStoryId,
          user,
          newTitle: title,
          chapters: currentChapters,
        });
        setDrafts(updatedDrafts);
      } catch (error) {
        console.log("Error updating draft", error);
      }
      setUpdateMsg(false);
    } else {
      alert("Please enter a title and at least one chapter.");
    }
  };

  const loadStoryForEditing = async (story: Story) => {
    const s = await fetchStoryById(story);

    if (!s) return;
    setTitle(s.title);
    setCurrentChapters(s.chapters);
    setEditingStoryId(s.storyId);
    setIsEditing(true);
    if (s.chapters.length > 0) {
      loadChapterForEditing(s.chapters[0]);
    } else {
      editor.commands.clearContent();
    }
  };

  const loadDraftForEditing = async (draft: Draft) => {
    console.log("loading draft for editing", draft);
    const s = await fetchDraftById(draft);

    if (!s) return;
    setTitle(s.title);
    setCurrentChapters(s.chapters);
    setEditingStoryId(s.draftId);
    setIsEditing(true);
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

  const toggleAiTools = () => setAitoolsVisible(!aitoolsVisible);
  const toggleRightColumn = () => setRightColumnVisible(!rightColumnVisible);

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
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc",
        },
      }),
      ListItem,
    ],
    content: "",
  }) as Editor;

  const getSelectedText = () => {
    return editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to
    );
  };

  const applyChanges = (newText: string) => {
    editor.chain().focus().setContent(newText, false).run();
  };

  const handleAction = async (actionType: string) => {
    const selectedText = getSelectedText();
    setSelectedText(selectedText);
    try {
      let result: string;
      switch (actionType) {
        case "summarize":
          result = await aiGenerator.summarizePlotOrScene(selectedText);
          break;
        case "paraphraseText":
          result = await aiGenerator.paraphraseText(selectedText);
          break;
        case "expandText":
          result = await aiGenerator.extpandText(selectedText);
          break;
        default:
          throw new Error("Unknown action type");
      }
      console.log(result);
      applyChanges(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex p-2 mt-4 justify-center overflow-auto">
      <BubbleMenu
        pluginKey="bubbleMenuText"
        className="bg-gray-800 text-white rounded-lg shadow-lg"
        tippyOptions={{ duration: 150 }}
        editor={editor}
        shouldShow={({ from, to }) => {
          // only show if range is selected.
          setSelectedText(editor.state.doc.textBetween(from, to));
          return from !== to;
        }}
      >
        <div className="flex min-w-[18rem] justify-center bg-gray-800 p-1 rounded-lg shadow-lg">
          <button
            className="py-1 px-3 m-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => handleAction("expandText")}
          >
            Expand
          </button>
          <button
            className="py-1 px-3 m-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => handleAction("paraphraseText")}
          >
            Paraphrase
          </button>
          <button
            className="py-1 px-3 m-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => handleAction("summarize")}
          >
            Summarize
          </button>
        </div>
      </BubbleMenu>
      <div className="flex h-screen w-full">
        {publishLoading && <div>Loading...</div>}
        <div
          className={`p-4 bg-amber-50 rounded-lg shadow-lg overflow-y-auto transition-all duration-300 ${
            rightColumnVisible ? "w-2/3" : "w-full"
          }`}
        >
          <h1 className="mb-4 text-3xl font-bold text-slate-800 italic">
            Summon your ultimate writing muse by pressing{" "}
            <span className="underline decoration-wavy text-blue-600">TAB</span>
          </h1>

          <div className="text-2xl mb-2">
            Authenticity Score: {Math.floor(Math.random() * 100)}%
          </div>
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

            <div className="min-h-full w-full flex flex-col">
              <div className="flex-grow overflow-auto">
                <div className="h-full w-full focus:outline-none bg-white selection:bg-blue-100">
                  <EditorContent
                    onClick={() => editor?.commands.focus()}
                    className="w-full min-h-[40rem] max-h-[40rem] overflow-auto focus:outline-none bg-white selection:bg-blue-100"
                    editor={editor}
                  />
                </div>
              </div>
              {savingMessage && (
                <div className="mt-2 text-center text-gray-500">
                  {savingMessage}
                </div>
              )}
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
            {updateMsg ? "Updating..." : "Update Draft"}
          </button>
          <button
            onClick={addDraft}
            className="w-full mt-2 p-2 bg-slate-400 text-white rounded hover:bg-slate-500"
          >
            Save as Draft
          </button>
          {editingStoryId ? (
            <button
              onClick={editStory}
              className="w-full mt-2 p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Update story
            </button>
          ) : (
            <button
              onClick={addStory}
              className="w-full p-2 mt-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Publish Story
            </button>
          )}
        </div>

        {/* AI Tools */}
        <div
          className={`transition-all duration-300 bg-amber-100 mx-2 ${
            aitoolsVisible ? "w-1/3" : "w-24"
          } flex flex-col`}
        >
          <div className="p-2 bg-amber-500 text-white rounded-t-lg hover:bg-amber-600 flex justify-center">
            {aitoolsVisible ? (
              <button
                onClick={toggleAiTools}
                className="flex items-center h-12 justify-center w-full"
              >
                <span className="flex items-center space-x-2">
                  <span>Hide Tools</span>
                </span>
              </button>
            ) : (
              <button
                onClick={toggleAiTools}
                className="flex items-center h-12 justify-center w-full"
              >
                <span className="flex items-center space-x-2">
                  <span>Show Tools</span>
                </span>
              </button>
            )}
          </div>
          {aitoolsVisible && (
            <div className="p-6 bg-amber-100 transition-all duration-300 flex-1">
              <AIPartners />
              <AITools text={selectedText} />
            </div>
          )}
        </div>

        {/* Chapters */}
        <div
          className={`transition-all duration-300 bg-amber-100 mx-2 ${
            rightColumnVisible ? "w-1/3" : "w-24"
          } flex flex-col`}
        >
          <div className="p-2 bg-amber-500 text-white rounded-t-lg hover:bg-amber-600 flex justify-center">
            {rightColumnVisible ? (
              <button
                onClick={toggleRightColumn}
                className="flex items-center h-12 justify-center w-full"
              >
                <span className="flex items-center space-x-2">
                  <span>Hide Chapters</span>
                </span>
              </button>
            ) : (
              <button
                onClick={toggleRightColumn}
                className="flex items-center h-12 justify-center w-full"
              >
                <span className="flex items-center space-x-2">
                  <span>Show Chapters</span>
                </span>
              </button>
            )}
          </div>

          {rightColumnVisible && (
            <div className="m-2 p-6 ">
              <h2 className="text-2xl font-bold mb-4 text-center text-amber-800">
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
          )}
        </div>
      </div>
    </div>
  );
}
