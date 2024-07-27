import { useUserNovels } from "../hooks/useUserNovels";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useDeleteNovel from "../hooks/useDeleteNovel";

export interface Novel {
  id: string;
  title: string;
  authorId: string;
  author: string;
  lastUpdated: string;
  contentPath: string;
}

const UserNovels = () => {
  const navigate = useNavigate();
  const {
    userNovels,
    loading: userNovelsLoading,
    error: userNovelsError,
  } = useUserNovels();

  const { deleteNovel, loading, error } = useDeleteNovel();

  const handleEdit = (novelId: string) => {
    console.log(`Edit novel with id: ${novelId}`);
    navigate(`/edit/${novelId}`);
  };

  const handleDelete = async (novel: Novel) => {
    // Handle delete logic
    console.log(`Delete novel with id: ${novel.id}`);
    const confirmed = window.confirm(
      "Are you sure you want to delete this novel?"
    );
    if (confirmed) {
      const success = await deleteNovel(novel.id, novel.contentPath);
      if (success) {
        console.log("Bug here, you need to reload the page to see the changes");
      }
    }
  };

  return (
    <>
      <div className="w-full lg:w-1/4 p-4 border-r">
        <h2 className="text-xl font-semibold mb-4">Your Work</h2>

        {userNovelsLoading && <p>Loading your novels...</p>}
        {userNovelsError && (
          <p className="text-red-500">Error: {userNovelsError}</p>
        )}

        <div className="space-y-4">
          {userNovels.map((novel) => (
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
                  onClick={() => handleDelete(novel)}
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
