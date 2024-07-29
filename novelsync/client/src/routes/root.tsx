import { useAuth } from "../contexts/AuthContext";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect } from "react";

import { INovel } from "../types/INovel";
import UserNovels from "../components/UserNovels";
import { useContext } from "react";
import NovelsContext from "../contexts/NovelsContext";

const Root: React.FC = () => {
  const { user } = useAuth();

  const novelsContext = useContext(NovelsContext);

  if (!novelsContext) {
    throw new Error("useNovels must be used within a NovelsProvider");
  }

  const { deleteNovelById, fetchNovels, novels, novelLoading, novelError } =
    novelsContext;

  useEffect(() => {
    fetchNovels();
  }, []);

  const handleDelete = async (novel: INovel) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this novel?"
    );
    if (confirmed) {
      await deleteNovelById(novel);
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
          {user && (
            <UserNovels
              novels={novels}
              loading={novelLoading}
              error={novelError}
              onDelete={handleDelete}
              user={user}
            />
          )}{" "}
          <div className="w-full lg:w-3/4 p-4">
            <h2 className="text-xl font-semibold mb-4">Recent Novels</h2>

            {novelLoading && <p>Loading novels...</p>}
            {novelError && <p className="text-red-500">Error: {novelError}</p>}

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
