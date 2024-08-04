import React, { useState, useContext } from "react";
import { SimpleEditor } from "./SimpleEditor";
import { useAuth } from "../contexts/AuthContext";
import NovelsContext from "../contexts/NovelsContext";
import { useNavigate } from "react-router-dom";
import { IChapter } from "../types/INovel";

interface ChaptersProps {
  edit: boolean;
}

const Chapters: React.FC<ChaptersProps> = ({ edit }) => {
  const [chapterName, setChapterName] = useState("");
  const [chapters, setChapters] = useState<
    { chapterName: string; content: string }[]
  >([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const novelsContext = useContext(NovelsContext);

  if (!novelsContext) {
    throw new Error("useNovels must be used within a NovelsProvider");
  }

  const { createNovel, selectedNovel } = novelsContext;

  const handleAddChapter = () => {
    if (isEditing) {
      console.log("here");
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterName === chapterName
            ? { chapterName, content }
            : chapter
        )
      );
    } else {
      setChapters([...chapters, { chapterName, content }]);
    }

    setChapterName("");
    setContent("");
    setIsEditing(false);
  };

  const handleChapterClick = (chapter: {
    chapterName: string;
    content: string;
  }) => {
    setChapterName(chapter.chapterName);
    setContent(chapter.content);
    setIsEditing(true);
  };

  const handlePublish = async () => {
    console.log("Publishing", {
      user,
      title,
      chapters,
    });

    await createNovel({
      user,
      title,
      chapters,
    });

    navigate("/home");
  };

  return (
    <div>
      {edit && selectedNovel ? (
        <div className="p-4 text-center justify-center flex">
          <SimpleEditor
            title={selectedNovel.novelData.title}
            chapterName={"chapterName"}
            content={"content"}
            setTitle={setTitle}
            setChapterName={setChapterName}
            setContent={setContent}
          />

          <div>
            <div className="mb-4">
              {selectedNovel.chapters.map(
                (chapter: IChapter, index: number) => (
                  <div
                    key={index}
                    className="mb-2 p-2 border rounded cursor-pointer"
                    onClick={() => handleChapterClick(chapter)}
                  >
                    {chapter.chapterName}
                  </div>
                )
              )}
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
      ) : (
        <div className="p-4 text-center justify-center flex">
          <SimpleEditor
            title={title}
            chapterName={chapterName}
            content={content}
            setTitle={setTitle}
            setChapterName={setChapterName}
            setContent={setContent}
          />

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
      )}
    </div>
  );
};

export default Chapters;
