import { useState } from "react";

import { IBookClub, IClub } from "../types/IClub";
import { v4 as uuidv4 } from "uuid";
import { Users, BookOpen, Clock, UserPlus, X, Plus } from "lucide-react";

// Demo data for book clubs
const bookClubs = [
  {
    id: "1",
    name: "Classic Literature Lovers",
    members: 1250,
    description:
      "Dive into the world of classic literature with fellow book enthusiasts.",
    category: "Classics",
    activity: "Very Active",
    image: "/api/placeholder/400/250",
  },
  {
    id: "2",
    name: "Sci-Fi & Fantasy Realm",
    members: 3420,
    description:
      "Explore otherworldly adventures and futuristic tales in this vibrant community.",
    category: "Science Fiction & Fantasy",
    activity: "Extremely Active",
    image: "/api/placeholder/400/250",
  },
  {
    id: "3",
    name: "Mystery & Thriller Addicts",
    members: 2100,
    description:
      "Unravel gripping mysteries and discuss heart-pounding thrillers with fellow addicts.",
    category: "Mystery & Thriller",
    activity: "Very Active",
    image: "/api/placeholder/400/250",
  },
  {
    id: "4",
    name: "Poetry Appreciation Society",
    members: 890,
    description:
      "Celebrate the beauty of words and rhythms in this poetic haven.",
    category: "Poetry",
    activity: "Moderately Active",
    image: "/api/placeholder/400/250",
  },
  {
    id: "5",
    name: "Historical Fiction Time Travelers",
    members: 1680,
    description:
      "Journey through different eras with captivating historical narratives.",
    category: "Historical Fiction",
    activity: "Very Active",
    image: "/api/placeholder/400/250",
  },
];

interface CreateBookClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateClub: (club: IClub) => void;
}

const CreateBookClubModal = ({
  isOpen,
  onClose,
  onCreateClub,
}: CreateBookClubModalProps) => {
  const [clubName, setClubName] = useState("");
  const [clubDescription, setClubDescription] = useState("");
  const [clubCategory, setClubCategory] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreateClub({
      id: uuidv4(),
      name: clubName,
      description: clubDescription,
      category: clubCategory,
      image: "/api/placeholder/400/250",
      members: 1,
      activity: "New",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create a New Book Club</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="clubName"
              className="block text-sm font-medium text-gray-700"
            >
              Club Name
            </label>
            <input
              type="text"
              id="clubName"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="clubDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="clubDescription"
              value={clubDescription}
              onChange={(e) => setClubDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              rows={3}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="clubCategory"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <input
              type="text"
              id="clubCategory"
              value={clubCategory}
              onChange={(e) => setClubCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Create Club
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BookClubCard = ({ club }: IBookClub) => {
  const [joined, setJoined] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <img
        src={club.image}
        alt={club.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{club.name}</h2>
        <p className="text-gray-600 mb-3">{club.description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Users size={16} className="mr-1" />
          <span className="mr-3">{club.members.toLocaleString()} members</span>
          <BookOpen size={16} className="mr-1" />
          <span className="mr-3">{club.category}</span>
          <Clock size={16} className="mr-1" />
          <span>{club.activity}</span>
        </div>
        <button
          onClick={() => setJoined(!joined)}
          className={`w-full py-2 px-4 rounded-full flex items-center justify-center ${
            joined ? "bg-gray-200 text-gray-800" : "bg-blue-600 text-white"
          }`}
        >
          {joined ? (
            <>
              <X size={16} className="mr-2" />
              Leave Group
            </>
          ) : (
            <>
              <UserPlus size={16} className="mr-2" />
              Join Group
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const BookClub = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clubs, setClubs] = useState(bookClubs);

  const handleCreateClub = (newClub: IClub) => {
    const clubWithDefaults = {
      ...newClub,
      id: uuidv4(),
      members: 1,
      activity: "New",
      image: "/api/placeholder/400/250",
    };
    setClubs([clubWithDefaults, ...clubs]);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Discover Book Clubs</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Create Club
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clubs.map((club) => (
          <BookClubCard key={club.id} club={club} />
        ))}
      </div>
      <CreateBookClubModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateClub={handleCreateClub}
      />
    </div>
  );
};

export default BookClub;
