import React, { useState } from "react";
import { generateSuggestions } from "./gemin";

const Suggestions = () => {
  const [desire, setDesire] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesire(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const newSuggestions = await generateSuggestions(desire);
      setSuggestions(newSuggestions);
      setDesire("");
    } catch (err) {
      setError("Failed to generate suggestions. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="desire" className="block text-lg font-bold mb-4">
            Need some help generating ideas?
          </label>
          <input
            id="desire"
            name="desire"
            value={desire}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="A grim dark character"
          />

          <button
            type="submit"
            disabled={isLoading || !desire.trim()}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isLoading || !desire.trim() ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Generating..." : "Generate Ideas"}
          </button>
        </form>
        {error && <p className="mt-4 text-red-600">{error}</p>}

        {suggestions.length > 0 &&
          suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg shadow-md hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => {
                console.log("clicked");
              }}
            >
              <p className="text-sm text-gray-600">{suggestion}.</p>
            </div>
          ))}
      </div>
    </>
  );
};

export default Suggestions;
