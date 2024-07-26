import { useParams } from "react-router-dom";
import { useNovel } from "../hooks/useNovel";

const NovelDetail = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>Invalid novel ID</div>;
  const { novel, content, loading, error } = useNovel(id);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!novel || !content) return <div>Novel not found</div>;

  return (
    <div>
      <h1>{novel.title}</h1>
      <p>By {novel.author}</p>
      <div>{content}</div>
    </div>
  );
};

export default NovelDetail;
