import { useState } from "react";
import { Plus } from "lucide-react";
import BookClubCard from "../../components/BookClubCard";
import { IClub } from "../../types/IClub";
import CreateBookClub from "./CreateBookClub";
import UpdateBookClub from "./UpdateBookClub";
import { useBookClub } from "../../contexts/BookClubContext";
import { useAuth } from "../../contexts/AuthContext";

const BookClubs = () => {
  const { bookClubs, createBookClub, updateBookClub } = useBookClub();
  const { user } = useAuth();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedClub, setSelectedClub] = useState<IClub | null>(null);

  const handleCreateClub = (newClub: IClub) => {
    if (user) {
      newClub.creatorId = user.uid;
    }
    createBookClub(newClub);
    setShowCreateForm(false);
  };

  const handleShowCreateForm = () => {
    setShowCreateForm(true);
  };

  const handleCancelCreateClub = () => {
    setShowCreateForm(false);
  };

  const handleUpdateClub = (updatedClub: IClub) => {
    updateBookClub(updatedClub.id, updatedClub);
    setShowUpdateForm(false);
    setSelectedClub(null);
  };

  const handleShowUpdateForm = (club: IClub) => {
    if (club.creatorId === user?.uid) {
      setSelectedClub(club);
      setShowUpdateForm(true);
    } else {
      alert("You can only update clubs you created.");
    }
  };

  const handleCancelUpdateClub = () => {
    setShowUpdateForm(false);
    setSelectedClub(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      {!showCreateForm && !showUpdateForm ? (
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
            {bookClubs.map((club) => (
              <BookClubCard
                key={club.id}
                club={club}
                onEdit={() => handleShowUpdateForm(club)}
              />
            ))}
          </div>
        </>
      ) : showCreateForm ? (
        <CreateBookClub
          onCreate={handleCreateClub}
          onCancel={handleCancelCreateClub}
        />
      ) : (
        showUpdateForm &&
        selectedClub && (
          <UpdateBookClub
            club={selectedClub}
            onUpdate={handleUpdateClub}
            onCancel={handleCancelUpdateClub}
          />
        )
      )}
    </div>
  );
};

export default BookClubs;
