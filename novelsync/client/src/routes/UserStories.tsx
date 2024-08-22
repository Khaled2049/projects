import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEditorContext } from "../contexts/EditorContext";
import { useAuth } from "../contexts/AuthContext";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Story } from "../types/IStory";

const UserStories = () => {
  const { user } = useAuth();
  const { fetchUserStories, userStories, deleteStoryById } = useEditorContext();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setLoading(true);
        await fetchUserStories(user);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleEdit = (story: Story) => {
    navigate("/create", { state: { story } });
  };

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

  if (loading) {
    return <div className="text-center py-6">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {userStories.length === 0 && (
        <p className="text-gray-600 text-center">
          Write something first, silly!
        </p>
      )}
      <div className="space-y-6 max-h-96 overflow-y-auto">
        {userStories.map((story) => (
          <div
            key={story.storyId}
            className="bg-amber-50 p-4 rounded-lg shadow-sm mb-4"
          >
            <h3 className="font-serif text-xl text-amber-900 mb-2">
              {story.title}
            </h3>
            <p className="text-gray-600 mb-1">By {story.author}</p>
            <p className="text-gray-500 text-sm">
              Last Updated: {new Date(story.lastUpdated).toLocaleDateString()}
            </p>
            <div className="mt-4 flex space-x-4">
              <Link
                to={`/novel/${story.storyId}`}
                className="bg-blue-500 px-3 py-2 flex text-white rounded hover:bg-blue-700"
              >
                Read
              </Link>
              <button
                onClick={() => handleEdit(story)}
                className="bg-green-500  flex  px-3 py-2 text-white rounded hover:bg-green-700"
              >
                <FaEdit className="mr-1" /> Edit
              </button>
              <button
                onClick={() => handleDelete(story)}
                className="bg-red-500  flex px-3 py-2 text-white rounded hover:bg-red-700"
              >
                <FaTrashAlt className="mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserStories;
