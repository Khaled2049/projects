import { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import NovelsContext from "../contexts/NovelsContext";
import { SimpleEditor } from "../components/SimpleEditor";

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

  if (!id) return <div>Invalid novel</div>;
  if (fetchNovelByIdLoading) return <div>Loading...</div>;
  if (fetchNovelByIdError) return <div>Error: {fetchNovelByIdError}</div>;
  if (!selectedNovel) return <div>Novel not found</div>;

  const { novelData, novelContent } = selectedNovel;

  return (
    <div>
      <SimpleEditor
        oldTitle={novelData.title}
        content={novelContent}
        edit={true}
        novelId={id}
      />
    </div>
  );
};

export default Edit;
