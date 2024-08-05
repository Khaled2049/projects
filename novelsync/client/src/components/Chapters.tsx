import React, { useState, useContext, useEffect } from "react";
import { SimpleEditor } from "./SimpleEditor";
import { useAuth } from "../contexts/AuthContext";
import NovelsContext from "../contexts/NovelsContext";
import { useNavigate } from "react-router-dom";
import { IChapter, INovelWithChapters } from "../types/INovel";

interface ChaptersProps {
  edit?: boolean;
}

const Chapters: React.FC<ChaptersProps> = ({ edit }) => {
  const [novelState, setNovelState] = useState<INovelWithChapters>({
    id: "",
    chaptersPath: "",
    author: "",
    authorId: "",
    lastUpdated: "",
    title: "",
    chapters: [],
    firstChapter: {
      chapterName: "",
      content: "",
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const novelsContext = useContext(NovelsContext);

  if (!novelsContext) {
    throw new Error("useNovels must be used within a NovelsProvider");
  }
  const { createNovel, selectedNovel } = novelsContext;

  useEffect(() => {
    if (edit && selectedNovel) {
      setNovelState(selectedNovel);
    }
  }, []);

  const handleAddChapter = () => {
    const updatedChapters = isEditing
      ? novelState.chapters.map((chapter) =>
          chapter.chapterName === novelState.firstChapter.chapterName
            ? novelState.firstChapter
            : chapter
        )
      : [...novelState.chapters, novelState.firstChapter];

    setNovelState({
      ...novelState,
      chapters: updatedChapters,
      firstChapter: { chapterName: "", content: "" },
    });

    setIsEditing(false);
  };

  const handleChapterClick = (chapter: IChapter) => {
    setNovelState({
      ...novelState,
      firstChapter: chapter,
    });

    setIsEditing(true);
  };

  const handlePublish = async () => {
    console.log("Publishing", {
      user,
      novelState,
    });

    await createNovel({
      user,
      title: novelState.title,
      chapters: novelState.chapters,
    });

    navigate("/home");
  };

  return (
    <div className="p-4 text-center justify-center flex">
      <div className="p-4 relative">
        <input
          type="text"
          value={novelState.title}
          onChange={(e) =>
            setNovelState({
              ...novelState,
              title: e.target.value,
            })
          }
          placeholder="Enter title here"
          className="w-full p-4 px-5 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <SimpleEditor novelState={novelState} setNovelState={setNovelState} />

      <div>
        <div className="mb-4">
          {novelState.chapters.map((chapter, index) => (
            <div
              key={index}
              className="mb-2 p-2 border rounded cursor-pointer"
              onClick={() => handleChapterClick(chapter)}
            >
              {chapter.chapterName}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center">
          <button
            onClick={handleAddChapter}
            className="bg-blue-500 m-2 w-40 text-white px-4 py-1 rounded"
          >
            {isEditing ? "Update Chapter" : "Add Chapter"}
          </button>
        </div>

        <button
          onClick={handlePublish}
          className="bg-blue-500 m-2 w-40 text-white px-4 py-1 rounded"
        >
          Publish
        </button>
      </div>
    </div>
  );
};

export default Chapters;
