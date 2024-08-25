import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import NovelsContext from "../contexts/NovelsContext";
import { FaTwitter, FaEnvelope, FaShareAlt } from "react-icons/fa";
import { IRenderContent } from "../types/INovel";
import Feedback from "../components/Feedback";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

import { useEditorContext } from "../contexts/EditorContext";

const NovelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [showFeedback, setShowFeedback] = useState(true);

  const [liked, setLiked] = useState<boolean>(false);

  if (!id)
    return (
      <div className="text-center text-red-500 mt-8">Invalid novel ID</div>
    );

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

  const { incrementLikes } = useEditorContext();

  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (id) {
      fetchNovelById(id);
    }
    setShareUrl(`${window.location.origin}/novel/${selectedNovel?.title}`);
  }, []);

  const handleWebShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedNovel?.title,
        text: `Check out this novel by ${selectedNovel?.author}`,
        url: shareUrl,
      });
    }
  };

  const handleLike = async (storyId: string) => {
    if (liked) return;

    setLiked(true);
    try {
      await incrementLikes(storyId);
    } catch (error) {
      console.error("Error liking story", error);
    }
  };

  if (fetchNovelByIdLoading)
    return <div className="text-center mt-8">Loading...</div>;
  if (fetchNovelByIdError) {
    return (
      <div className="text-center text-red-500 mt-8">
        Error: {fetchNovelByIdError}
      </div>
    );
  }

  const renderContent = (content: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const elements = Array.from(doc.body.childNodes);

    return elements.map((el, index) => {
      if (el.nodeName === "P") {
        return <p key={index}>{el.textContent}</p>;
      } else if (el.nodeName === "IMG") {
        const src = (el as HTMLImageElement).src;
        return (
          <div key={index} className="flex justify-center mb-4">
            <img src={src} alt="" className="max-w-full h-auto" />
          </div>
        );
      } else if (el.nodeName === "UL") {
        const listItems = Array.from(el.childNodes).map((li, liIndex) => (
          <li key={liIndex} className="ml-6 list-disc">
            {(li as HTMLElement).textContent}
          </li>
        ));
        return (
          <ul key={index} className="mb-4">
            {listItems}
          </ul>
        );
      } else {
        return null;
      }
    });
  };

  return (
    selectedNovel && (
      <>
        <div className="max-w-[90%] md:max-w-[75%] lg:max-w-[65%] mx-auto p-4 md:p-8 rounded-lg mt-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-center text-amber-900">
            {selectedNovel.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-1 md:mb-2 text-center">
            By {selectedNovel.author}
          </p>
          <p className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6 text-center">
            Last updated:{" "}
            {new Date(selectedNovel.lastUpdated).toLocaleDateString()}
          </p>
          <div className="prose prose-lg max-w-none bg-white p-4 md:p-6 rounded-md leading-relaxed shadow-md">
            {selectedNovel.chapters.map((chapter: IRenderContent) => (
              <div key={chapter.chapterName} className="mb-6">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-amber-900">
                  {chapter.chapterName}
                </h2>
                <div className="text-base md:text-lg text-gray-800">
                  {renderContent(chapter.content)}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 md:gap-4 mt-6">
            <button
              className={`like-button ${liked ? "liked" : ""}`}
              onClick={() => handleLike(selectedNovel.id)}
              disabled={liked}
            >
              {liked ? (
                <AiFillHeart className="icon" />
              ) : (
                <AiOutlineHeart className="icon" />
              )}
            </button>
            <button
              className="flex items-center px-3 py-2 md:px-4 md:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
              onClick={handleWebShare}
            >
              <FaShareAlt className="mr-1 md:mr-2" /> Share
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `Check out this novel by ${selectedNovel.author}: ${shareUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 md:px-4 md:py-2 bg-slate-800 text-white rounded hover:bg-blue-500 transition-colors duration-300"
            >
              <FaTwitter className="mr-1 md:mr-2" /> Share on X
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(
                `Check out this novel by ${selectedNovel.author}`
              )}&body=${encodeURIComponent(shareUrl)}`}
              className="flex items-center px-3 py-2 md:px-4 md:py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300"
            >
              <FaEnvelope className="mr-1 md:mr-2" /> Share via Email
            </a>
          </div>
        </div>
      </>
    )
  );
};

{
  /* <div className="flex flex-col items-center">
  <button
    className="px-4 py-2 my-4 text-white bg-amber-600 rounded hover:bg-amber-700"
    onClick={() => setShowFeedback(!showFeedback)}
  >
    {showFeedback ? "Hide Feedback" : "Show Feedback"}
  </button>
  {showFeedback && <Feedback novelId={id} />}
</div> */
}
export default NovelDetail;
