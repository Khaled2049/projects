import React, { useState } from "react";
import { User, BookIcon, Send, UserPlus } from "lucide-react";

// Mock data
const authors = [
  { id: 1, name: "Jane Austen" },
  { id: 2, name: "George Orwell" },
  { id: 3, name: "Virginia Woolf" },
  { id: 4, name: "F. Scott Fitzgerald" },
  { id: 5, name: "Toni Morrison" },
];

const posts = [
  {
    id: 1,
    author: "Jane Austen",
    content: "Just finished the first draft of my new novel!",
    likes: 42,
  },
  {
    id: 2,
    author: "George Orwell",
    content: "Thoughts on dystopian futures?",
    likes: 38,
  },
  {
    id: 3,
    author: "Virginia Woolf",
    content: "Stream of consciousness writing workshop this weekend!",
    likes: 27,
  },
];

const bookClubs = [
  { id: 1, name: "Classic Literature Club" },
  { id: 2, name: "Sci-Fi Enthusiasts" },
  { id: 3, name: "Poetry Corner" },
];

const Community: React.FC = () => {
  const [status, setStatus] = useState("");

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Status submitted:", status);
    setStatus("");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left column - Authors list */}
      <div className="w-1/4 bg-white p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Authors</h2>
        <ul>
          {authors.map((author) => (
            <li
              key={author.id}
              className="flex items-center mb-2 p-2 hover:bg-gray-100 rounded"
            >
              <User className="mr-2" />
              <span>{author.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Middle column - User feed */}
      <div className="w-1/2 bg-white p-4 overflow-y-auto">
        {/* Status update form */}
        <form onSubmit={handleStatusSubmit} className="mb-6">
          <div className="flex items-center bg-gray-100 rounded-lg p-2">
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="What's on your mind?"
              className="flex-grow bg-transparent outline-none"
            />
            <button type="submit" className="ml-2">
              <Send size={20} />
            </button>
          </div>
        </form>

        {/* Posts */}
        {posts.map((post) => (
          <div key={post.id} className="bg-white shadow rounded-lg p-4 mb-4">
            <div className="flex items-center mb-2">
              <User className="mr-2" />
              <span className="font-bold">{post.author}</span>
            </div>
            <p className="mb-2">{post.content}</p>
            <div className="flex items-center text-gray-500">
              <BookIcon size={16} className="mr-1" />
              <span>{post.likes} likes</span>
            </div>
          </div>
        ))}
      </div>

      {/* Right column - Book clubs */}
      <div className="w-1/4 bg-white p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Book Clubs</h2>
        <ul>
          {bookClubs.map((club) => (
            <li key={club.id} className="mb-4 p-3 bg-gray-100 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{club.name}</span>
                <button className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center">
                  <UserPlus size={16} className="mr-1" />
                  Join
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Community;
