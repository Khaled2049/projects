import { useParams } from "react-router-dom";
import { useNovel } from "../hooks/useNovel";

const NovelDetail = () => {
  const { id } = useParams<{ id: string }>();

  if (!id)
    return (
      <div className="text-center text-red-500 mt-8">Invalid novel ID</div>
    );

  const { novel, content, loading, error } = useNovel(id);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 mt-8">Error: {error}</div>;
  if (!novel || !content)
    return <div className="text-center text-red-500 mt-8">Novel not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h1 className="text-4xl font-bold mb-4 text-center">{novel.title}</h1>
      <p className="text-xl text-gray-700 mb-2 text-center">
        By {novel.author}
      </p>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Last updated: {new Date(novel.lastUpdated).toLocaleDateString()}
      </p>
      <div className="prose prose-lg max-w-none bg-gray-50 p-4 rounded-md leading-relaxed">
        {content.split("\n").map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};

export default NovelDetail;
