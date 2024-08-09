import React, { useState, useRef, useEffect } from "react";
import { generateSuggestions } from "./gemin";
import { Book, Feather, Loader } from "lucide-react";

const Suggestions = () => {
  const [desire, setDesire] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

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

  const handleHideSuggestions = () => {
    setSuggestions([]);
  };

  useEffect(() => {
    if (suggestionsRef.current) {
      suggestionsRef.current.scrollTop = suggestionsRef.current.scrollHeight;
    }
  }, [suggestions]);

  return (
    <div className="bg-amber-50 rounded-lg shadow-lg border border-amber-200 overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex items-center mb-4 sm:mb-6">
          <Book className="text-amber-700 mr-2 flex-shrink-0" size={24} />
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-900 truncate">
            Novel Idea Generator
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label
            htmlFor="desire"
            className="block text-base sm:text-lg font-serif font-semibold text-amber-800"
          >
            What kind of idea are you looking for?
          </label>
          <div className="relative">
            <input
              id="desire"
              name="desire"
              value={desire}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 border-2 border-amber-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-amber-900 placeholder-amber-400 text-sm sm:text-base"
              placeholder="e.g., A grim dark character"
            />
            <Feather
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400"
              size={18}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !desire.trim()}
            className={`w-full bg-amber-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors duration-200 text-sm sm:text-base ${
              isLoading || !desire.trim() ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader className="animate-spin mr-2" size={18} />
                Brewing Ideas...
              </span>
            ) : (
              "Generate Ideas"
            )}
          </button>
        </form>
        {error && (
          <p className="mt-4 text-red-600 font-semibold text-sm sm:text-base">
            {error}
          </p>
        )}
      </div>
      {suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="bg-white border-t-2 border-amber-200 p-3 sm:p-4 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-400 scrollbar-track-amber-100"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="mb-2 sm:mb-3 p-2 sm:p-3 bg-amber-50 rounded-md hover:bg-amber-100 cursor-pointer transition-colors duration-200"
              onClick={() => {
                console.log("clicked");
              }}
            >
              <p className="text-xs sm:text-sm text-amber-900 font-serif">
                {suggestion}
              </p>
            </div>
          ))}
        </div>
      )}
      {suggestions.length > 0 && (
        <div className="p-4">
          <button
            onClick={handleHideSuggestions}
            className="w-full text-center text-amber-600 hover:text-amber-800 font-semibold text-sm sm:text-base transition-colors duration-200"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default Suggestions;
