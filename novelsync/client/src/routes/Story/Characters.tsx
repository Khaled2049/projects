import React, { useEffect, useState } from "react";
import { PlusCircle, Trash2, ChevronRight, ChevronDown, X } from "lucide-react";

interface Character {
  id: number;
  name: string;
  age: number;
  backstory: string;
  affiliations?: string;
  notes?: string;
}

type NewCharacter = Omit<Character, "id">;

const initialCharacters: Character[] = [
  {
    id: 1,
    name: "Alice",
    age: 28,
    affiliations: "The Agency",
    backstory: "A brilliant detective with a mysterious past.",
  },
  {
    id: 2,
    name: "Bob",
    age: 35,
    backstory: "A charming con artist trying to go straight.",
  },
];

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (character: Omit<Character, "id">) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [newCharacter, setNewCharacter] = useState<Omit<Character, "id">>({
    name: "",
    age: 0,
    backstory: "",
    affiliations: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newCharacter);
    setNewCharacter({
      name: "",
      age: 0,
      backstory: "",
      affiliations: "",
      notes: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add New Character</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newCharacter.name}
            onChange={(e) =>
              setNewCharacter({ ...newCharacter, name: e.target.value })
            }
            placeholder="Place name"
            className="w-full p-2 mb-2 border border-amber-300 rounded-md"
            required
          />

          <input
            type="text"
            value={newCharacter.age}
            onChange={(e) =>
              setNewCharacter({
                ...newCharacter,
                age: parseInt(e.target.value),
              })
            }
            placeholder="Age"
            className="w-full p-2 mb-2 border border-amber-300 rounded-md"
            required
          />

          <input
            type="text"
            value={newCharacter.backstory}
            onChange={(e) =>
              setNewCharacter({ ...newCharacter, backstory: e.target.value })
            }
            placeholder="Backstory"
            className="w-full p-2 mb-2 border border-amber-300 rounded-md"
            required
          />

          <input
            type="text"
            value={newCharacter.affiliations}
            onChange={(e) =>
              setNewCharacter({
                ...newCharacter,
                affiliations: e.target.value,
              })
            }
            placeholder="Affiliations"
            className="w-full p-2 mb-2 border border-amber-300 rounded-md"
          />

          <input
            type="text"
            value={newCharacter.notes}
            onChange={(e) =>
              setNewCharacter({ ...newCharacter, notes: e.target.value })
            }
            placeholder="Notes"
            className="w-full p-2 mb-4 border border-amber-300 rounded-md"
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
            >
              Add Character
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Characters: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (characters.length > 0 && !selectedCharacter) {
      setSelectedCharacter(characters[0]);
    }
  }, [characters, selectedCharacter]);

  const addCharacter = (newCharacter: NewCharacter) => {
    const character: Character = {
      ...newCharacter,
      id: Date.now(),
    };
    setCharacters([...characters, character]);
    setIsModalOpen(false);
  };

  const deleteCharacter = (id: number) => {
    setCharacters(characters.filter((character) => character.id !== id));
    if (selectedCharacter?.id === id) {
      setSelectedCharacter(null);
    }
  };

  return (
    <div className="p-6 bg-amber-50 min-h-screen">
      <h1 className="text-3xl font-bold text-amber-800 mb-6">characters</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Place List */}
        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mb-4 bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors flex items-center"
          >
            <PlusCircle size={20} className="mr-2" />
            Add New Character
          </button>

          <ul className="space-y-2 overflow-y-auto max-h-[calc(100vh-250px)]">
            {characters.map((character) => (
              <li
                key={character.id}
                className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${
                  selectedCharacter?.id === character.id
                    ? "bg-amber-200"
                    : "bg-white hover:bg-amber-100"
                }`}
                onClick={() => setSelectedCharacter(character)}
              >
                <span>{character.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCharacter(character.id);
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column - Place Details */}
        <div className="bg-white p-4 rounded-md shadow-md">
          {selectedCharacter ? (
            <div>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">
                {selectedCharacter.name}
              </h2>
              <p className="text-gray-600">
                <span className="font-bold">Age:</span> {selectedCharacter.age}
              </p>
              <p className="text-gray-600">
                <span className="font-bold">Backstory:</span>{" "}
                {selectedCharacter.backstory}
              </p>
              {selectedCharacter.affiliations && (
                <p className="text-gray-600">
                  <span className="font-bold">Affiliations:</span>{" "}
                  {selectedCharacter.affiliations}
                </p>
              )}
              {selectedCharacter.notes && (
                <p className="text-gray-600">
                  <span className="font-bold">Notes:</span>{" "}
                  {selectedCharacter.notes}
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Select a place to view details</p>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addCharacter}
      />
    </div>
  );
};

export default Characters;
