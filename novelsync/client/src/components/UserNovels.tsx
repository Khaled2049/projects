import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { INovel } from "../types/INovel";

interface UserNovelsProps {
  novels: INovel[];
  loading: boolean;
  error: string | null;
  onDelete: (novel: INovel) => void;
}

const UserNovels: React.FC<UserNovelsProps> = ({
  novels,
  loading,
  error,
  onDelete,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleEdit = (novelId: string) => {
    console.log(`Edit novel with id: ${novelId}`);
    navigate(`/edit/${novelId}`);
  };

  return (
    <>
      <div className="w-full lg:w-1/4 p-4 border-r">
        {user ? (
          <h2 className="text-xl font-semibold mb-4">Your Work</h2>
        ) : (
          <h2 className="text-lg mb-4">
            <Link
              className="font-semibold text-blue-500 underline hover:text-blue-700"
              to="/sign-in"
            >
              Sign in
            </Link>{" "}
            to see your work
          </h2>
        )}

        {loading && <p>Loading your novels...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        <div className="space-y-4">
          {novels.map((novel) => (
            <div key={novel.id} className="border p-4 rounded shadow">
              <h3 className="font-semibold">{novel.title}</h3>
              <p>Author: {novel.author}</p>
              <p>
                Last Updated: {new Date(novel.lastUpdated).toLocaleDateString()}
              </p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleEdit(novel.id)}
                  className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  <FaEdit className="mr-1" /> Edit
                </button>
                <button
                  onClick={() => onDelete(novel)}
                  className="flex items-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
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
