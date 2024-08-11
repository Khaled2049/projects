import { useAuth } from "../contexts/AuthContext";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";

import { INovelWithChapters } from "../types/INovel";
import UserNovels from "../components/UserNovels";
import NovelsContext from "../contexts/NovelsContext";
import Suggestions from "../components/Suggestions";

const Root: React.FC = () => {
  const { user } = useAuth();
  const novelsContext = useContext(NovelsContext);

  if (!novelsContext) {
    throw new Error("useNovels must be used within a NovelsProvider");
  }

  const { deleteNovelById, fetchNovels, novels, novelLoading, novelError } =
    novelsContext;

  const [currentPage, setCurrentPage] = useState(1);
  const [isUserNovelsVisible, setIsUserNovelsVisible] = useState(false);

  const novelsPerPage = 9;
  const indexOfLastNovel = currentPage * novelsPerPage;
  const indexOfFirstNovel = indexOfLastNovel - novelsPerPage;
  const currentNovels = novels.slice(indexOfFirstNovel, indexOfLastNovel);
  const totalPages = Math.ceil(novels.length / novelsPerPage);

  useEffect(() => {
    fetchNovels();
  }, []);

  const handleDelete = async (novel: INovelWithChapters) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this novel?"
    );
    if (confirmed) {
      await deleteNovelById(novel);
    }
  };

  const toggleUserNovels = () => {
    setIsUserNovelsVisible(!isUserNovelsVisible);
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
          <div
            className={`fixed top-20 right-0 h-100 bg-white shadow-lg transition-transform duration-300 ${
              isUserNovelsVisible ? "translate-x-0" : "translate-x-[95%]"
            }`}
          >
            <button
              onClick={toggleUserNovels}
              className="absolute top-4 left-[-40px] bg-amber-600 text-white p-2 rounded-full hover:bg-amber-700 transition-colors duration-200 flex items-center"
            >
              {isUserNovelsVisible ? <FaArrowRight /> : <FaArrowLeft />}
            </button>
            {user && (
              <div className="p-4">
                <UserNovels
                  loading={novelLoading}
                  error={novelError}
                  onDelete={handleDelete}
                  user={user}
                />
              </div>
            )}
          </div>
          <div className="w-full lg:w-1/4 px-4 border-r-2 border-amber-700">
            <Suggestions />
          </div>

          <div className="w-full lg:w-3/4 px-4">
            <h2 className="text-2xl font-serif text-amber-900 mb-6">
              Recent Novels
            </h2>

            {novelLoading && <p className="text-gray-600">Loading novels...</p>}
            {novelError && <p className="text-red-500">Error: {novelError}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentNovels.map((novel) => (
                <div
                  key={novel.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="font-serif text-xl text-amber-900 mb-2">
                    {novel.title}
                  </h3>
                  <p className="text-gray-600 mb-1">By {novel.author}</p>
                  <p className="text-gray-500 text-sm mb-4">
                    Last Updated:{" "}
                    {new Date(novel.lastUpdated).toLocaleDateString()}
                  </p>
                  <Link
                    to={`/novel/${novel.id}`}
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
