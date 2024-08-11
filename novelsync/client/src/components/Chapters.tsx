import React, { useState, useContext, useEffect } from "react";
import { SimpleEditor } from "./SimpleEditor";
import { useAuth } from "../contexts/AuthContext";
import NovelsContext from "../contexts/NovelsContext";
import { useNavigate } from "react-router-dom";
import { IChapter } from "../types/INovel";
import DigitalTimer from "./Timer";
import AIPartners from "./AIPartners";
import { Loader } from "lucide-react";

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

  const {
    createLoading,
    createNovel,
    selectedNovel,
    updateNovelById,
    setSelectedNovel,
    createError,
  } = novelsContext;

  const handleAddChapter = () => {
    let updatedChapters;

    if (selectedNovel.chapters.length === 5) {
      alert(
        "You can only have 5 chapters for now, sorry mr. pro, I'm working on it"
      );
      return;
    }

    if (isEditing) {
      updatedChapters = selectedNovel.chapters.map((chapter) => {
        if (chapter.chapterName === selectedNovel.firstChapter.chapterName) {
          return selectedNovel.firstChapter;
        } else {
          return chapter;
        }
      });
    } else {
      updatedChapters = [...selectedNovel.chapters, selectedNovel.firstChapter];
    }

    setSelectedNovel({
      ...selectedNovel,
      chapters: updatedChapters,
      firstChapter: { chapterName: "", content: "" },
    });

    setIsEditing(false);
  };

  const handleChapterClick = (chapter: IChapter) => {
    setSelectedNovel({
      ...selectedNovel,
      firstChapter: chapter,
    });

    setIsEditing(true);
  };

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
      console.log("createError", createError);
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

  const handleUpdate = async () => {
    await updateNovelById({
      id: selectedNovel.id,
      title: selectedNovel.title,
      chapters: selectedNovel.chapters,
    });

    navigate("/");
  };

  return (
    <div className="relative flex flex-col h-screen">
      {createLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
            <Loader className="animate-spin" size={24} />
            <span className="text-lg font-semibold">
              Publishing... but first Imma check some stuff so chill...
            </span>
          </div>
        </div>
      )}

      <div className="w-full text-center p-4">
        <h1 className="text-3xl font-bold text-slate-800 italic">
          Summon your ultimate writing muse by pressing{" "}
          <span className="underline decoration-wavy text-blue-600">TAB</span>
        </h1>
      </div>

      <div className="flex h-full">
        <div className="w-3/5 p-2 mt-4 overflow-auto">
          <SimpleEditor />
        </div>

        {/* Right side columns (40%) */}
        <div className="w-2/5 flex flex-col">
          {/* First row: Chapters and Timer */}
          <div className="flex h-1/2 p-4">
            {/* Chapters Column */}
            <div className="w-1/2 mx-2 p-6 overflow-hidden flex flex-col bg-amber-50 rounded-lg shadow-lg border border-amber-200">
              <h2 className="text-2xl font-serif mb-4 text-amber-800">
                Chapters
              </h2>
              <div className="flex-grow overflow-auto mb-4 pr-2 custom-scrollbar">
                {selectedNovel.chapters.map((chapter, index) => (
                  <div
                    key={index}
                    className="mb-3 p-3 bg-white shadow-md rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg hover:bg-amber-100"
                    onClick={() => handleChapterClick(chapter)}
                  >
                    <span className="font-serif text-amber-900">{`Chapter ${
                      index + 1
                    }:`}</span>
                    <span className="ml-2 text-gray-700">
                      {chapter.chapterName}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center justify-center space-y-3">
                <button
                  onClick={handleAddChapter}
                  className="w-full bg-amber-600 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:bg-amber-700 transition-colors duration-200"
                >
                  {isEditing ? "Update Chapter" : "Add Chapter"}
                </button>
                {edit ? (
                  <button
                    onClick={handleUpdate}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:bg-green-700 transition-colors duration-200"
                  >
                    Update Novel
                  </button>
                ) : (
                  <button
                    onClick={handlePublish}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Publish Novel
                  </button>
                )}
              </div>
            </div>

            {/* Timer Column */}
            <div className="w-1/2 p-6 mx-2 overflow-hidden flex flex-col bg-amber-50 rounded-lg shadow-lg border border-amber-200">
              <DigitalTimer />
            </div>
          </div>

          {/* Second row: Suggestions */}
          <div className="h-1/2 p-4">
            <AIPartners />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chapters;
