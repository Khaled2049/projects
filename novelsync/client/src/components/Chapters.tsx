import React, { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

interface ChaptersProps {
  title: string;
}

const Chapters: React.FC<ChaptersProps> = ({ title }) => {
  const [chapterName, setChapterName] = useState("");
  const [chapters, setChapters] = useState<string[]>([]);

  const handleAddChapter = () => {
    console.log("Adding chapter:", chapterName);
    // if (chapterName.trim() !== "") {
    //   setChapters([...chapters, chapterName]);
    //   setChapterName("");
    // }
  };
  const handleDeleteChapter = () => {
    console.log("Delete chapter:", chapterName);
    // if (chapterName.trim() !== "") {
    //   setChapters([...chapters, chapterName]);
    //   setChapterName("");
    // }
  };

  return (
    <div className="p-4 text-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Chapters</h1>
      {title.length > 0 && (
        <h2 className="text-lg mb-4 border-b-2">
          {title}{" "}
          <button
            onClick={handleDeleteChapter}
            className="text-red px-3 py-2 rounded"
          >
            <FaTrashAlt className="mr-1" />
          </button>
        </h2>
      )}
      <div className="mb-4">
        {chapters.map((chapter, index) => (
          <div key={index} className="mb-2 p-2 border rounded">
            {chapter}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center">
        <button
          onClick={handleAddChapter}
          className="bg-blue-500 m-2 w-40 text-white px-4 py-1 rounded"
        >
          Add Chapter
        </button>
      </div>
    </div>
  );
};

export default Chapters;
