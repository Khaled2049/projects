import { useParams } from "react-router-dom";
import { useNovel } from "../hooks/useNovel";
import { useEffect, useState } from "react";
import { FaTwitter, FaEnvelope, FaShareAlt } from "react-icons/fa";

const NovelDetail = () => {
  const { id } = useParams<{ id: string }>();

  if (!id)
    return (
      <div className="text-center text-red-500 mt-8">Invalid novel ID</div>
    );

  const { novel, content, loading, error } = useNovel(id);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (novel) {
      setShareUrl(`${window.location.origin}/novel/${novel.id}`);
    }
  }, [novel]);

  const handleWebShare = () => {
    if (navigator.share) {
      navigator.share({
        title: novel?.title,
        text: `Check out this novel by ${novel?.author}`,
        url: shareUrl,
      });
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 mt-8">Error: {error}</div>;
  if (!novel || !content)
    return <div className="text-center text-red-500 mt-8">Novel not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-50 shadow-md rounded-lg mt-8">
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
      <div className="flex justify-center gap-4 mt-6">
        <button
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleWebShare}
        >
          <FaShareAlt className="mr-2" /> Share
        </button>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `Check out this novel by ${novel.author}: ${shareUrl}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-4 py-2 bg-slate-800 text-white rounded hover:bg-blue-500"
        >
          <FaTwitter className="mr-2" /> Share on X
        </a>
        <a
          href={`mailto:?subject=${encodeURIComponent(
            `Check out this novel by ${novel.author}`
          )}&body=${encodeURIComponent(shareUrl)}`}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <FaEnvelope className="mr-2" /> Share via Email
        </a>
      </div>
    </div>
  );
};

export default NovelDetail;
