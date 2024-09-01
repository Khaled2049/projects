import React, { useEffect, useState } from "react";
import { User, BookIcon, Send, UserPlus, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { IUser } from "../../types/IUser";

const bookClubs = [
  { id: 1, name: "Classic Literature Club" },
  { id: 2, name: "Sci-Fi Enthusiasts" },
  { id: 3, name: "Poetry Corner" },
];

const Home: React.FC = () => {
  const [status, setStatus] = useState("");
  const [users, setUsers] = useState<IUser[]>([]);

  const { fetchUsersOrderedByLastLogin } = useAuthContext();

  useEffect(() => {
    fetchUsersOrderedByLastLogin(5).then((users) => {
      setUsers(users);
    });
  }, []);

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Status submitted:", status);
    setStatus("");
  };

  const [currentTab, setCurrentTab] = useState("discover");

  const [posts] = useState([
    { id: 1, author: "John Doe", content: "Loving this new book!", likes: 12 },
    {
      id: 2,
      author: "Jane Smith",
      content: "Writing is my therapy.",
      likes: 8,
    },
    {
      id: 3,
      author: "Alice Johnson",
      content: "Poetry is the essence of soul.",
      likes: 15,
    },
    { id: 4, author: "Mark Brown", content: "Reading a lot lately!", likes: 5 },
  ]);
  const [following, setFollowing] = useState(["Jane Smith", "Mark Brown"]);

  const filteredPosts =
    currentTab === "myFeed"
      ? posts.filter((post) => following.includes(post.author))
      : posts;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-amber-50">
      {/* Left column - Authors list */}
      <div className="w-full lg:w-1/4 bg-amber-50 p-4 overflow-y-auto">
        <h2 className="text-2xl font-serif font-bold mb-4 text-amber-900">
          Authors
        </h2>
        <ul>
          {users.map((author) => (
            <li
              key={author.uid}
              className="flex items-center mb-2 p-2 hover:bg-amber-200 rounded transition duration-300"
            >
              <User className="mr-2 text-amber-700" />
              <span className="font-serif text-amber-800">
                {author.username}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Middle column - User feed */}
      <div className="w-full lg:w-1/2 bg-amber-50 p-4 overflow-y-auto  border-amber-200">
        {/* Status update form */}
        <form onSubmit={handleStatusSubmit} className="mb-6">
          <div className="flex items-center bg-amber-50 rounded-lg p-2 border border-amber-200">
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Share your literary thoughts..."
              className="flex-grow bg-transparent outline-none font-serif text-amber-900 p-3"
            />
            <button
              type="submit"
              className="ml-2 text-amber-700 hover:text-amber-900"
            >
              <Send size={20} />
            </button>
          </div>
        </form>

        <div className="flex justify-between mb-4">
          <button
            onClick={() => setCurrentTab("discover")}
            className={`w-full py-2 px-4 text-center font-serif font-bold ${
              currentTab === "discover"
                ? "bg-amber-600 text-white"
                : "bg-amber-200 text-amber-900"
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => setCurrentTab("myFeed")}
            className={`w-full py-2 px-4 text-center font-serif font-bold ${
              currentTab === "myFeed"
                ? "bg-amber-600 text-white"
                : "bg-amber-200 text-amber-900"
            }`}
          >
            My Feed
          </button>
        </div>

        {/* Posts */}
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-amber-50 shadow rounded-lg p-4 mb-4 border border-amber-200"
          >
            <div className="flex items-center mb-2">
              <User className="mr-2 text-amber-700" />
              <span className="font-serif font-bold text-amber-900">
                {post.author}
              </span>
            </div>
            <p className="mb-2 font-serif text-amber-800">{post.content}</p>
            <div className="flex items-center text-amber-600">
              <BookOpen size={16} className="mr-1" />
              <span>{post.likes} likes</span>
            </div>
          </div>
        ))}
      </div>

      {/* Right column - Book clubs */}
      <div className="w-full lg:w-1/4 bg-amber-50 p-4 overflow-y-auto">
        <h2 className="text-2xl font-serif font-bold mb-4 text-amber-900">
          Book Clubs
        </h2>
        <ul>
          {bookClubs.map((club) => (
            <li
              key={club.id}
              className="mb-4 p-3 bg-white rounded-lg border border-amber-200"
            >
              <div className="flex justify-between items-center">
                <span className="font-serif font-semibold text-amber-900">
                  {club.name}
                </span>
                <button className="bg-amber-600 text-white px-3 py-1 rounded-full flex items-center hover:bg-amber-700 transition duration-300">
                  <UserPlus size={16} className="mr-1" />
                  Join
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-center items-center">
          <Link
            to="/book-clubs"
            className="w-full mt-4 text-center bg-amber-700 text-white py-2 px-4 rounded-full hover:bg-amber-800 transition duration-300 font-serif mx-auto"
            style={{ maxWidth: "200px" }} // Optional: Set a max width if you want a specific size
          >
            View All Clubs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
