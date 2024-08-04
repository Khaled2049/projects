import React, { useState, useContext } from "react";
import { SimpleEditor } from "./SimpleEditor";
import { useAuth } from "../contexts/AuthContext";
import NovelsContext from "../contexts/NovelsContext";
import { useNavigate } from "react-router-dom";

interface INovel {
  title: string;
  chapterName: string;
  content: string;
}

interface ChaptersProps {}

const Chapters: React.FC<ChaptersProps> = () => {
  const [novel, setNovel] = useState<INovel>({
    title: "",
    chapterName: "",
    content: "",
  });
  const [chapters, setChapters] = useState<INovel[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const novelsContext = useContext(NovelsContext);

  if (!novelsContext) {
    throw new Error("useNovels must be used within a NovelsProvider");
  }

  const { createNovel } = novelsContext;

  const handleAddChapter = () => {
    if (isEditing) {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterName === novel.chapterName ? novel : chapter
        )
      );
    } else {
      setChapters([...chapters, novel]);
    }

    setNovel({ ...novel, chapterName: "", content: "" });
    setIsEditing(false);
  };

  const handleChapterClick = (chapter: INovel) => {
    setNovel(chapter);
    setIsEditing(true);
  };

  const handlePublish = async () => {
    console.log("Publishing", {
      user,
      novel,
      chapters,
    });

    await createNovel({
      user,
      title: novel.title,
      chapters,
    });

    navigate("/home");
  };

  return (
    <div className="p-4 text-center justify-center flex">
      <SimpleEditor novel={novel} setNovel={setNovel} />

      <div>
        <div className="mb-4">
          {chapters.map((chapter, index) => (
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
