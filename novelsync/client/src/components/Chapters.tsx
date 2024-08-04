import React, { useState, useContext } from "react";
import { SimpleEditor } from "./SimpleEditor";
import { useAuth } from "../contexts/AuthContext";
import NovelsContext from "../contexts/NovelsContext";
import { useNavigate } from "react-router-dom";

interface IChapter {
  chapterName: string;
  content: string;
}

interface INovel {
  title: string;
  chapters: IChapter[];
}

interface ChaptersProps {
  edit?: boolean;
}

const Chapters: React.FC<ChaptersProps> = () => {
  const [novel, setNovel] = useState<INovel>({ title: "", chapters: [] });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const novelsContext = useContext(NovelsContext);

  if (!novelsContext) {
    throw new Error("useNovels must be used within a NovelsProvider");
  }

  const { createNovel } = novelsContext;

  const handlePublish = async () => {
    console.log("Publishing", {
      user,
      novel,
    });

    await createNovel({
      user,
      title: novel.title,
      chapters: novel.chapters,
    });

    navigate("/home");
  };

  return (
    <div className="p-4 text-center justify-center flex">
      <SimpleEditor
        novel={novel}
        setNovel={setNovel}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        handlePublish={handlePublish}
      />
    </div>
  );
};

export default Chapters;
