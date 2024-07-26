import { useUserNovels } from "../hooks/useUserNovels";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
const UserNovels = () => {
  const {
    userNovels,
    loading: userNovelsLoading,
    error: userNovelsError,
  } = useUserNovels();

  const handleEdit = (novelId: string) => {
    console.log(`Edit novel with id: ${novelId}`);
  };

  const handleDelete = async (novelId: string) => {
    // Handle delete logic
    console.log(`Delete novel with id: ${novelId}`);
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
                  onClick={() => handleDelete(novel.id)}
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
