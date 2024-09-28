import React, { useEffect, useState } from "react";
import { PlusCircle, X } from "lucide-react";

interface Place {
  id: string;
  name: string;
  details: string;
  climate: string;
  population: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (place: Omit<Place, "id">) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [newPlace, setNewPlace] = useState<Omit<Place, "id">>({
    name: "",
    details: "",
    climate: "",
    population: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newPlace);
    setNewPlace({ name: "", details: "", climate: "", population: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add New Place</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newPlace.name}
            onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
            placeholder="Place name"
            className="w-full p-2 mb-2 border border-amber-300 rounded-md"
            required
          />
          <textarea
            value={newPlace.details}
            onChange={(e) =>
              setNewPlace({ ...newPlace, details: e.target.value })
            }
            placeholder="Details"
            className="w-full p-2 mb-2 border border-amber-300 rounded-md"
            required
          />
          <input
            type="text"
            value={newPlace.climate}
            onChange={(e) =>
              setNewPlace({ ...newPlace, climate: e.target.value })
            }
            placeholder="Climate"
            className="w-full p-2 mb-2 border border-amber-300 rounded-md"
            required
          />
          <input
            type="text"
            value={newPlace.population}
            onChange={(e) =>
              setNewPlace({ ...newPlace, population: e.target.value })
            }
            placeholder="Population"
            className="w-full p-2 mb-4 border border-amber-300 rounded-md"
            required
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
              Add Place
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Places: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([
    {
      id: "1",
      name: "Mystic Forest",
      details: "A dense, magical forest with ancient trees.",
      climate: "Temperate",
      population: "Sparse",
    },
    {
      id: "2",
      name: "Crystal City",
      details: "A futuristic city with buildings made of crystal.",
      climate: "Controlled",
      population: "Dense",
    },
  ]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (places.length > 0 && !selectedPlace) {
      setSelectedPlace(places[0]);
    }
  }, [places, selectedPlace]);

  const addPlace = (newPlace: Omit<Place, "id">) => {
    const place: Place = {
      ...newPlace,
      id: Date.now().toString(),
    };
    setPlaces([...places, place]);
    setIsModalOpen(false);
  };

  const deletePlace = (id: string) => {
    setPlaces(places.filter((place) => place.id !== id));
    if (selectedPlace?.id === id) {
      setSelectedPlace(null);
    }
  };

  return (
    <div className="p-6 bg-amber-50 min-h-screen">
      <h1 className="text-3xl font-bold text-amber-800 mb-6">Places</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Place List */}
        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mb-4 bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors flex items-center"
          >
            <PlusCircle size={20} className="mr-2" />
            Add New Place
          </button>

          <ul className="space-y-2 overflow-y-auto max-h-[calc(100vh-250px)]">
            {places.map((place) => (
              <li
                key={place.id}
                className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${
                  selectedPlace?.id === place.id
                    ? "bg-amber-200"
                    : "bg-white hover:bg-amber-100"
                }`}
                onClick={() => setSelectedPlace(place)}
              >
                <span>{place.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePlace(place.id);
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
          {selectedPlace ? (
            <div>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">
                {selectedPlace.name}
              </h2>
              <p className="mb-2">
                <strong>Details:</strong> {selectedPlace.details}
              </p>
              <p className="mb-2">
                <strong>Climate:</strong> {selectedPlace.climate}
              </p>
              <p>
                <strong>Population:</strong> {selectedPlace.population}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">Select a place to view details</p>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addPlace}
      />
    </div>
  );
};

export default Places;
