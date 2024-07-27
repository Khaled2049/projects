import { useParams } from "react-router-dom";
import { useNovel } from "../hooks/useNovel";
import { SimpleEditor } from "../components/SimpleEditor";
import Navbar from "../components/Navbar";

const Edit = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>Invalid novel</div>;

  const { novel, content, loading, error } = useNovel(id);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!novel || !content) return <div>Novel not found</div>;

  return (
    <div>
      <Navbar />
      <SimpleEditor
        oldTitle={novel.title}
        content={content}
        edit={true}
        novelId={id}
      />
    </div>
  );
};

export default Edit;
