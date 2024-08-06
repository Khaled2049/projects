import React, { useState, useContext, useEffect } from "react";
import { SimpleEditor } from "./SimpleEditor";
import { useAuth } from "../contexts/AuthContext";
import NovelsContext from "../contexts/NovelsContext";
import { useNavigate } from "react-router-dom";
import { IChapter } from "../types/INovel";

interface ChaptersProps {
  edit?: boolean;
}

const Chapters: React.FC<ChaptersProps> = ({ edit }) => {
  useEffect(() => {
    if (!edit) {
      setSelectedNovel({
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
    }
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const novelsContext = useContext(NovelsContext);

  if (!novelsContext) {
    throw new Error("useNovels must be used within a NovelsProvider");
  }
  const { createNovel, selectedNovel, updateNovelById, setSelectedNovel } =
    novelsContext;

  const handleAddChapter = () => {
    const updatedChapters = isEditing
      ? selectedNovel.chapters.map((chapter) =>
          chapter.chapterName === selectedNovel.firstChapter.chapterName
            ? selectedNovel.firstChapter
            : chapter
        )
      : [...selectedNovel.chapters, selectedNovel.firstChapter];

    setSelectedNovel({
      ...selectedNovel,
      chapters: updatedChapters,
      firstChapter: { chapterName: "", content: "" },
    });

    setIsEditing(false);
  };

  const handleChapterClick = (chapter: IChapter) => {
    console.log("chapter", chapter);

    setSelectedNovel({
      ...selectedNovel,
      firstChapter: chapter,
    });

    setIsEditing(true);
  };

  const handlePublish = async () => {
    await createNovel({
      user,
      title: selectedNovel.title,
      chapters: selectedNovel.chapters,
    });

    navigate("/home");
  };

  const handleUpdate = async () => {
    console.log("Updating", {
      user,
      selectedNovel,
    });

    await updateNovelById({
      id: selectedNovel.id,
      title: selectedNovel.title,
      chapters: selectedNovel.chapters,
    });

    navigate("/home");
  };

  return (
    <div className="p-4 text-center justify-center flex">
      <SimpleEditor />

      <div>
        <div className="mb-4">
          {selectedNovel.chapters.map((chapter, index) => (
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
        <button
          onClick={handleUpdate}
          className="bg-blue-500 m-2 w-40 text-white px-4 py-1 rounded"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default Chapters;
