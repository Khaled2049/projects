import { FaBook, FaEdit, FaTrashAlt } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { AuthUser } from "../types/IUser";
import { useEditorContext } from "../contexts/EditorContext";
import { Story } from "../types/IStory";

interface UserNovelsProps {
  onDelete: (story: Story) => void;
  onEdit: (story: Story) => void;
  user: AuthUser;
}

const UserNovels: React.FC<UserNovelsProps> = ({ onDelete, onEdit, user }) => {
  // const navigate = useNavigate();

  const { userStories, fetchUserStories } = useEditorContext();

  useEffect(() => {
    if (user) {
      fetchUserStories(user);
    }
  }, [user]);

  return (
    <>
      <div className="w-full p-6 bg-amber-200 rounded-lg">
        {user ? (
          <h2 className="text-2xl font-serif text-amber-900 mb-6 flex items-center">
            <FaBook className="mr-2" />
            Your Work
          </h2>
        ) : (
          <h2 className="text-lg mb-6 font-serif text-amber-900">
            <Link
              className="font-semibold text-amber-600 hover:text-amber-700 transition-colors duration-200"
              to="/sign-in"
            >
              Sign in
            </Link>{" "}
            to see your work
          </h2>
        )}

        {userStories.length === 0 && (
          <p className="text-gray-600">Write something first silly!</p>
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
              <p className="text-gray-500 text-sm mb-4">
                Last Updated: {new Date(story.lastUpdated).toLocaleDateString()}
              </p>
              <div className="flex space-x-3 mt-2">
                <button
                  onClick={() => onEdit(story)}
                  className="flex items-center text-white px-3 py-2 rounded-full bg-gray-400"
                >
                  <FaEdit className="mr-1" /> Edit
                </button>
                <button
                  onClick={() => onDelete(story)}
                  className="flex items-center bg-red-500 text-white px-3 py-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                >
                  <FaTrashAlt className="mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserNovels;
