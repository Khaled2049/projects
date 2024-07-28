import { useAuth } from "../contexts/AuthContext";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNovels } from "../hooks/useNovels";
import useDeleteNovel from "../hooks/useDeleteNovel";
import { INovel } from "../types/INovel";
import UserNovels from "../components/UserNovels";

const Root: React.FC = () => {
  const { user } = useAuth();
  const { novels, loading, error, setNovels } = useNovels(20); // Fetch up to 20 novels

  const { deleteNovel } = useDeleteNovel();

  const handleDelete = async (novel: INovel) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this novel?"
    );
    if (confirmed) {
      const success = await deleteNovel(novel.id, novel.contentPath);
      if (success) {
        setNovels(novels.filter((n) => n.id !== novel.id));
      }
    }
  };

  return (
    <>
      <div className="container mx-auto px-4">
        {user && (
          <div className="max-w-4xl mx-auto p-4 relative mt-4">
            <h1 className="text-2xl mb-4">
              Hi {user.username}! Work on something new today
              <Link to="/create">
                <FaArrowRight className="inline-block text-gray-950 ml-3 text-3xl" />
              </Link>
            </h1>
          </div>
        )}

        <div className="flex flex-wrap">
          <UserNovels
            novels={novels}
            loading={loading}
            error={error}
            onDelete={handleDelete}
          />
          <div className="w-full lg:w-3/4 p-4">
            <h2 className="text-xl font-semibold mb-4">Recent Novels</h2>

            {loading && <p>Loading novels...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {novels.map((novel) => (
                <div key={novel.id} className="border p-4 rounded shadow">
                  <h3 className="font-semibold">{novel.title}</h3>
                  <p>Author: {novel.author}</p>
                  <p>
                    Last Updated:{" "}
                    {new Date(novel.lastUpdated).toLocaleDateString()}
                  </p>
                  <Link
                    to={`/novel/${novel.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Read
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Root;
