import React, { useState } from "react";
import { PlusCircle, Trash2, ChevronRight, ChevronDown } from "lucide-react";

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

const Characters: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [newCharacter, setNewCharacter] = useState<NewCharacter>({
    name: "",
    age: 0,
    backstory: "",
  });
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );

  const addCharacter = (): void => {
    if (newCharacter.name && newCharacter.age && newCharacter.backstory) {
      const char = { ...newCharacter, id: Date.now() };
      setCharacters([...characters, char]);
      setNewCharacter({ name: "", age: 0, backstory: "" });
      setSelectedCharacter(char);
    }
  };

  const removeCharacter = (id: number): void => {
    setCharacters(characters.filter((char) => char.id !== id));
    if (selectedCharacter?.id === id) {
      setSelectedCharacter(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setNewCharacter((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) || 0 : value,
    }));
  };

  const handleCharacterClick = (char: Character): void => {
    setSelectedCharacter(selectedCharacter?.id === char.id ? null : char);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-amber-50 ">
      <div className="mb-6 bg-amber-100 shadow-lg rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2 text-amber-800">
          Add New Character
        </h2>
        <div className="space-y-2">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newCharacter.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-amber-200 rounded bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={newCharacter.age || ""}
            onChange={handleInputChange}
            className="w-full p-2 border border-amber-200 rounded bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <input
            type="text"
            name="affiliations"
            placeholder="Affiliations"
            value={newCharacter.affiliations || ""}
            onChange={handleInputChange}
            className="w-full p-2 border border-amber-200 rounded bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <textarea
            name="backstory"
            placeholder="Backstory"
            value={newCharacter.backstory}
            onChange={handleInputChange}
            className="w-full p-2 border border-amber-200 rounded bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
            rows={3}
          />
          <textarea
            name="notes"
            placeholder="notes"
            value={newCharacter.notes}
            onChange={handleInputChange}
            className="w-full p-2 border border-amber-200 rounded bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
            rows={3}
          />
          <button
            onClick={addCharacter}
            className="flex items-center justify-center w-full bg-amber-800 text-amber-50 p-2 rounded hover:bg-amber-700 transition"
          >
            <PlusCircle className="mr-2" size={20} />
            Add Character
          </button>
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={addCharacter}
          className="flex items-center justify-center w-full bg-amber-800 text-amber-50 p-2 rounded hover:bg-amber-700 transition"
        >
          <PlusCircle className="mr-2" size={20} />
          All Characters
        </button>
      </div>

      <div className="bg-amber-100 shadow-lg rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2 text-amber-800">
          Characters
        </h2>
        <ul className="space-y-2">
          {characters.map((char) => (
            <li key={char.id} className="border-b border-amber-200 pb-2">
              <button
                onClick={() => handleCharacterClick(char)}
                className="w-full text-left flex justify-between items-center p-2 hover:bg-amber-200 rounded transition"
              >
                <span className="text-amber-800">{char.name}</span>
                {selectedCharacter?.id === char.id ? (
                  <ChevronDown size={20} className="text-amber-800" />
                ) : (
                  <ChevronRight size={20} className="text-amber-800" />
                )}
              </button>
              {selectedCharacter?.id === char.id && (
                <div className="mt-2 pl-4 bg-amber-50 p-3 rounded">
                  <p className="text-amber-800">Age: {char.age}</p>
                  <p className="mt-1 text-sm text-amber-800">
                    {char.backstory}
                  </p>
                  <button
                    onClick={() => removeCharacter(char.id)}
                    className="mt-2 text-red-500 hover:text-red-700 flex items-center"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Remove Character
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Characters;
