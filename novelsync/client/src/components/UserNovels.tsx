import { FaBook, FaEdit, FaTrashAlt } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { INovelWithChapters } from "../types/INovel";
import { useContext, useEffect, useState } from "react";
import NovelsContext from "../contexts/NovelsContext";
import { AuthUser } from "../types/IUser";

interface UserNovelsProps {
  loading: boolean;
  error: string | null;
  onDelete: (novel: INovelWithChapters) => void;
  user: AuthUser;
}

const UserNovels: React.FC<UserNovelsProps> = ({
  loading,
  error,
  onDelete,
  user,
}) => {
  // const navigate = useNavigate();

  const [showMsg, setShowMsg] = useState(false);
  const novelsContext = useContext(NovelsContext);

  if (!novelsContext) {
    throw new Error("useNovels must be used within a NovelsProvider");
  }

  const { userNovels, fetchNovelsByUserId } = novelsContext;

  useEffect(() => {
    if (user) {
      fetchNovelsByUserId(user.uid);
    }
  }, [user]);

  const handleEdit = (novelId: string) => {
    console.log("novelId", novelId);
    console.log("Editing is currently disabled");
    setShowMsg(true);
    // navigate(`/edit/${novelId}`);
    setTimeout(() => {
      setShowMsg(false);
    }, 2000);
  };

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

        {loading && <p className="text-gray-600">Loading your novels...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {userNovels.length === 0 && !loading && (
          <p className="text-gray-600">Write something first silly!</p>
        )}
        <div className="space-y-6 max-h-96 overflow-y-auto">
          {showMsg && (
            <p className="text-amber-600 bg-amber-100 p-3 rounded-lg">
              Editing is currently disabled
            </p>
          )}

          {userNovels.map((novel) => (
            <div
              key={novel.id}
              className="bg-amber-50 p-4 rounded-lg shadow-sm mb-4"
            >
              <h3 className="font-serif text-xl text-amber-900 mb-2">
                {novel.title}
              </h3>
              <p className="text-gray-600 mb-1">By {novel.author}</p>
              <p className="text-gray-500 text-sm mb-4">
                Last Updated: {new Date(novel.lastUpdated).toLocaleDateString()}
              </p>
              <div className="flex space-x-3 mt-2">
                <button
                  onClick={() => handleEdit(novel.id)}
                  disabled={true}
                  className="flex items-center text-white px-3 py-2 rounded-full bg-gray-400 cursor-not-allowed"
                >
                  <FaEdit className="mr-1" /> Edit
                </button>
                <button
                  onClick={() => onDelete(novel)}
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
