import { useAuthContext } from "../../contexts/AuthContext";
import { FaArrowRight, FaEye, FaThumbsUp } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Suggestions from "../../components/Suggestions";
import RandomTopic from "../../components/RandomTopic";
import { storiesRepo, StoryMetadata } from "../../components/StoriesRepo";

const AllStories: React.FC = () => {
  const { user } = useAuthContext();

  const [currentPage, setCurrentPage] = useState(1);

  const [stories, setStories] = useState<StoryMetadata[]>([]);
  const storiesPerPage = 9;
  const indexOfLastNovel = currentPage * storiesPerPage;
  const indexOfFirstNovel = indexOfLastNovel - storiesPerPage;
  const currentStories = stories.slice(indexOfFirstNovel, indexOfLastNovel);
  const totalPages = Math.ceil(stories.length / storiesPerPage);

  const navigate = useNavigate();

  useEffect(() => {
    loadStories();
  }, []);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleNewStory = async () => {
    if (user) {
      const newStoryId = await storiesRepo.createStory(
        "New Story",
        "",
        user.uid
      );
      navigate(`/create/${newStoryId}`);
    } else {
      // Handle the case where the user is not authenticated
      console.error("User not authenticated");
    }
  };

  const loadStories = async () => {
    const storyList = await storiesRepo.getPublishedStories();
    setStories(storyList);
  };

  const handleStoryClick = async (story: StoryMetadata) => {
    const storyData = await storiesRepo.getStory(story.id);
    if (storyData) {
      storiesRepo.incrementViewCount(story.id);
      navigate(`/story/${story.id}`);
    }
  };

  return (
    <div className="bg-amber-50 min-h-screen py-8 relative ">
      <div className="container mx-auto px-4">
        {user ? (
          <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mb-8">
            <h1 className="text-3xl font-serif text-amber-900 mb-4 flex items-center justify-between">
              {user.displayName ? (
                <span>Welcome back, {user.displayName || ""}!</span>
              ) : (
                <span>Welcome Back!</span>
              )}
              <button
                onClick={handleNewStory}
                className="bg-amber-600 text-white px-4 py-2 rounded-full font-sans text-base hover:bg-amber-700 transition-colors duration-200 flex items-center"
              >
                Start a New Story
                <FaArrowRight className="ml-2" />
              </button>
            </h1>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mb-8">
            <h1 className="text-3xl font-serif text-amber-900 mb-4 flex items-center justify-between">
              <span>Welcome to NovelSync!</span>
              <Link
                to="/sign-in"
                className="bg-amber-600 text-white px-4 py-2 rounded-full font-sans text-base hover:bg-amber-700 transition-colors duration-200 flex items-center"
              >
                Sign In
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
              {currentStories.map((story) => (
                <div
                  onClick={() => handleStoryClick(story)}
                  key={story.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="font-serif text-xl text-amber-900 mb-2">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 mb-1">By {story.author}</p>
                  <p className="text-gray-500 text-sm mb-4">
                    Last Updated:{" "}
                    {new Date(story.updatedAt).toLocaleDateString()}
                  </p>

                  <div className="flex items-center mt-4 text-gray-600 text-sm">
                    <div className="flex items-center mr-2">
                      <FaEye className="mr-1" /> {story.views}
                    </div>
                    <div className="flex items-center mr-2">
                      <FaThumbsUp className="mr-1" /> {story.likes}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* New Stories */}

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

export default AllStories;
