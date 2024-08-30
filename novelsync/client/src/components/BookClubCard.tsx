import { useState } from "react";
import { IClub } from "../types/IClub";
import {
  BookOpen,
  Clock,
  UserPlus,
  Users,
  X,
  Edit,
  Trash2,
} from "lucide-react";

interface BookClubCardProps {
  club: IClub;
  onEdit: () => void;
  onDelete: () => void;
}

const BookClubCard = ({ club, onEdit, onDelete }: BookClubCardProps) => {
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

        <div className="flex justify-between items-center">
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

          {/* Edit and Delete Buttons */}
          <div className="ml-4 flex space-x-2">
            <button
              onClick={onEdit}
              className="py-2 px-3 bg-yellow-500 text-white rounded-full flex items-center justify-center"
            >
              <Edit size={16} className="mr-2" />
              Edit
            </button>
            <button
              onClick={onDelete}
              className="py-2 px-3 bg-red-600 text-white rounded-full flex items-center justify-center"
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookClubCard;
