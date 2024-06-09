import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleOptionClick = () => {
    navigate("/form/step1");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">
        Colonoscopy Procedure Prep Forms
      </h1>
      <div className="space-y-4 flex flex-col">
        {" "}
        {/* Updated */}
        <button
          onClick={handleOptionClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Plenvu
        </button>
        <button
          onClick={handleOptionClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sutab
        </button>
        <button
          onClick={handleOptionClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Miralax/Gatorade Prep
        </button>
        <button
          onClick={handleOptionClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Golytely
        </button>
        <button
          onClick={handleOptionClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Golytely 2 Day Prep
        </button>
      </div>
    </div>
  );
};

export default HomePage;
