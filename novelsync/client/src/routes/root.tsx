import { useAuth } from "../contexts/AuthContext";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserNovels from "../components/UserNovels";
import NovelsContext from "../contexts/NovelsContext";
import Suggestions from "../components/Suggestions";
import RandomTopic from "../components/RandomTopic";
import { useEditorContext } from "../contexts/EditorContext";
import { Story } from "../types/IStory";

const Root: React.FC = () => {
  const { user } = useAuth();
  const novelsContext = useContext(NovelsContext);

  if (!novelsContext) {
    throw new Error("useNovels must be used within a NovelsProvider");
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [isUserNovelsVisible, setIsUserNovelsVisible] = useState(false);

  const { stories, deleteStoryById, fetchAllStories } = useEditorContext();

  const novelsPerPage = 9;
  const indexOfLastNovel = currentPage * novelsPerPage;
  const indexOfFirstNovel = indexOfLastNovel - novelsPerPage;
  const currentNovels = stories.slice(indexOfFirstNovel, indexOfLastNovel);
  const totalPages = Math.ceil(stories.length / novelsPerPage);

  useEffect(() => {
    fetchAllStories();
  }, []);

  const handleDelete = async (story: Story) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this novel?"
    );
    if (!user) {
      return;
    }
    if (confirmed) {
      await deleteStoryById(story, user);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-amber-50 min-h-screen py-8 relative ">
      <div className="container mx-auto px-4">
        {user && (
          <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mb-8">
            <h1 className="text-3xl font-serif text-amber-900 mb-4 flex items-center justify-between">
              <span>Welcome back, {user.username}!</span>
              <Link
                to="/create"
                className="bg-amber-600 text-white px-4 py-2 rounded-full font-sans text-base hover:bg-amber-700 transition-colors duration-200 flex items-center"
              >
                Start Writing
                <FaArrowRight className="ml-2" />
              </Link>
            </h1>
          </div>
        )}
        <div className="flex flex-wrap mx-4">
          <div className="w-full lg:w-1/4 px-4 border-r-2 border-amber-700 space-y-4">
            <RandomTopic />
            <Suggestions />
          </div>

          <div className="w-full lg:w-3/4 px-4">
            <h2 className="text-2xl font-serif text-amber-900 mb-6">Stories</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentNovels.map((story) => (
                <div
                  key={story.storyId}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="font-serif text-xl text-amber-900 mb-2">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 mb-1">By {story.author}</p>
                  <p className="text-gray-500 text-sm mb-4">
                    Last Updated:{" "}
                    {new Date(story.lastUpdated).toLocaleDateString()}
                  </p>
                  <Link
                    to={`/novel/${story.storyId}`}
                    className="inline-block bg-amber-100 text-amber-800 px-4 py-2 rounded-full hover:bg-amber-200 transition-colors duration-200"
                  >
                    Read Now
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`mx-1 px-3 py-1 rounded ${
                      currentPage === pageNumber
                        ? "bg-amber-600 text-white"
                        : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Root;
