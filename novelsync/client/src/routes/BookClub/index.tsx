import { useState } from "react";

import { Plus } from "lucide-react";
import BookClubCard from "../../components/BookClubCard";
import { IClub } from "../../types/IClub";
import CreateBookClub from "./CreateBookClub";
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
];

const BookClubs = () => {
  const [clubs, setClubs] = useState(bookClubs);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateClub = (newClub: IClub) => {
    setClubs([newClub, ...clubs]);
    setShowCreateForm(false); // Hide the form after creating the club
  };

  const handleShowCreateForm = () => {
    setShowCreateForm(true);
  };

  const handleCancelCreateClub = () => {
    setShowCreateForm(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      {!showCreateForm ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Discover Book Clubs</h1>
            <button
              onClick={handleShowCreateForm}
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
        </>
      ) : (
        <CreateBookClub
          onCreate={handleCreateClub}
          onCancel={handleCancelCreateClub}
        />
      )}
    </div>
  );
};

export default BookClubs;
