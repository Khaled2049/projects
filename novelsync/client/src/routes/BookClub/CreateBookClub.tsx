import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IClub } from "../../types/IClub";
import { AuthUser } from "../../types/IUser";

const CreateBookClub = ({
  user,
  onCreate,
  onCancel,
}: {
  user: AuthUser;
  onCreate: (newClub: IClub) => void;
  onCancel: () => void;
}) => {
  const [newClub, setNewClub] = useState({
    name: "",
    description: "",
    category: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewClub({
      ...newClub,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateClub = () => {
    const clubWithDefaults = {
      ...newClub,
      id: uuidv4(),
      members: [user.uid],
      activity: "New",
      image: "/api/placeholder/400/250",
      creatorId: user.uid,
    };
    onCreate(clubWithDefaults);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h2 className="text-xl font-semibold mb-4">Create New Club</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Club Name</label>
        <input
          type="text"
          name="name"
          value={newClub.name}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg mt-1"
          placeholder="Enter club name"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Description</label>
        <textarea
          name="description"
          value={newClub.description}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg mt-1"
          placeholder="Enter club description"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Category</label>
        <input
          type="text"
          name="category"
          value={newClub.category}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg mt-1"
          placeholder="Enter club category"
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full mr-2"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateClub}
          className="bg-blue-600 text-white px-4 py-2 rounded-full"
        >
          Create Club
        </button>
      </div>
    </div>
  );
};

export default CreateBookClub;
