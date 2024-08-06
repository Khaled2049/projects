import { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import NovelsContext from "../contexts/NovelsContext";
import Chapters from "../components/Chapters";

const Edit = () => {
  const { id } = useParams<{ id: string }>();

  const novelsContext = useContext(NovelsContext);

  if (!novelsContext) {
    throw new Error("useNovels must be used within a NovelsProvider");
  }

  const {
    selectedNovel,
    fetchNovelById,
    fetchNovelByIdError,
    fetchNovelByIdLoading,
  } = novelsContext;

  useEffect(() => {
    if (id) {
      fetchNovelById(id);
    }
  }, []);

  // const { novelData, chapters } = selectedNovel;
  if (fetchNovelByIdLoading) {
    return <div className="text-center mt-8">Loading...</div>;
  }
  if (fetchNovelByIdError) {
    return (
      <div className="text-center text-red-500 mt-8">
        Error: {fetchNovelByIdError}
      </div>
    );
  }

  return (
    selectedNovel && (
      <div>
        <Chapters edit={true} />
      </div>
    )
  );
};

export default Edit;
