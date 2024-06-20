import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useEffect } from "react";

const Root: React.FC = () => {
  const navigate = useNavigate();

  const handleOptionClick = (option: string) => {
    navigate(`${option}`);
  };

  const options = [
    "Plenvu",
    "Sutab",
    "MiralaxG",
    "Golytely",
    "GolytelyTwoDayPrep",
  ];

  // useEffect(() => {
  //   const test = async () => {
  //     const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

  //     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  //     const prompt = "What are the steps for colonoscopy prep?";

  //     const result = await model.generateContent(prompt);
  //     const response = await result.response;
  //     const text = response.text();
  //     console.log(text);
  //   };

  //   test();
  // }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">
        Colonoscopy Procedure Prep Forms
      </h1>

      <div className="space-y-4 flex flex-col">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleOptionClick(option)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {option}
          </button>
        ))}
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Root;
