import "./style.css";
import { useEffect, useRef, useState } from "react";
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
import BulletList from "@tiptap/extension-bullet-list";
import { Extension } from "@tiptap/core";
import { AITextGenerator } from "./AITextGenerator";
import ListItem from "@tiptap/extension-list-item";
import CollapsibleDiv from "./CollapsibleDiv";

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

export function SimpleEditor() {
  const [isEditing, setIsEditing] = useState(false);
  const [rightColumnVisible, setRightColumnVisible] = useState(true);
  const [aitoolsVisible, setAitoolsVisible] = useState(true);
  const toggleAiTools = () => setAitoolsVisible(!aitoolsVisible);
  const toggleRightColumn = () => setRightColumnVisible(!rightColumnVisible);
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

  const navigate = useNavigate();

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
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc",
        },
      }),
      ListItem,
    ],
    content: "",
  }) as Editor;

  const location = useLocation();

  useEffect(() => {
    if (location.state?.draft) {
      loadDraftForEditing(location.state?.draft);
    } else if (location.state?.story) {
      loadStoryForEditing(location.state?.story);
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
  const [savingMessage, setSavingMessage] = useState("");

  return (
    <div className="flex p-2 mt-4 justify-center overflow-auto w-full">
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

            <div className="min-h-[28rem] w-full flex justify-center">
              <div className="w-full focus:outline-none bg-white selection:bg-blue-100">
                <EditorContent
                  onClick={() => editor?.commands.focus()}
                  className="w-full focus:outline-none bg-white selection:bg-blue-100"
                  editor={editor}
                />
                <EditorContent editor={editor} />
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
                  <span>Hide AI Tools</span>
                </span>
              </button>
            ) : (
              <button
                onClick={toggleAiTools}
                className="flex items-center h-12 justify-center w-full"
              >
                <span className="flex items-center space-x-2">
                  <span>Show AI Tools</span>
                </span>
              </button>
            )}
          </div>
          {aitoolsVisible && (
            <div className="p-6 bg-amber-100 transition-all duration-300 flex-1">
              <AIPartners />
            </div>
          )}
        </div>

        {/* Right Column */}
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
                  <span>Hide Organizer</span>
                </span>
              </button>
            ) : (
              <button
                onClick={toggleRightColumn}
                className="flex items-center h-12 justify-center w-full"
              >
                <span className="flex items-center space-x-2">
                  <span>Show Organizer</span>
                </span>
              </button>
            )}
          </div>

          {rightColumnVisible && (
            <div className="p-6 bg-gray-100 transition-all duration-300 flex-1">
              <CollapsibleDiv title="Chapters">
                <div className="p-6 bg-amber-50 rounded-lg shadow-lg">
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
              </CollapsibleDiv>
              <CollapsibleDiv title="Outline">
                <div>Working on it :)</div>
              </CollapsibleDiv>
              <CollapsibleDiv title="Plot">
                <div>Working on it :)</div>
              </CollapsibleDiv>
              <CollapsibleDiv title="Characters">
                <div>Working on it :)</div>
              </CollapsibleDiv>
              <CollapsibleDiv title="Places">
                <div>Working on it :)</div>
              </CollapsibleDiv>
              <CollapsibleDiv title="Objects">
                <div>Working on it :)</div>
              </CollapsibleDiv>
              <CollapsibleDiv title="Themes">
                <div>Working on it :)</div>
              </CollapsibleDiv>
              <CollapsibleDiv title="Magic System">
                <div>Working on it :)</div>
              </CollapsibleDiv>
              <CollapsibleDiv title="Rules">
                <div>Working on it :)</div>
              </CollapsibleDiv>
              <CollapsibleDiv title="Notes">
                <div>Working on it :)</div>
              </CollapsibleDiv>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
