import { useState, useRef, useEffect } from "react";
import { AITextGenerator } from "./AITextGenerator";
import { useNavigate } from "react-router-dom";

import { Loader } from "lucide-react";
import { useEditorContext } from "../contexts/EditorContext";

const RandomTopic = () => {
  const [randomTopic, setRandomTopic] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const randomTopicsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { setsuggestion } = useEditorContext();
  const aiGenerator = new AITextGenerator(0);

  const getTopic = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const randomTopic = await aiGenerator.generateRandomTopic();
      setRandomTopic(randomTopic);
    } catch (err) {
      setError("Failed to generate Topic. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // getTopic();
  }, []);

  return (
    <div className="max-w-md bg-amber-50 rounded-lg shadow-lg border border-amber-200 overflow-hidden">
      <div className="bg-amber-200 p-3 sm:p-4">
        <h2 className="text-lg sm:text-xl text-amber-900 font-bold font-serif">
          Write a story about
        </h2>
      </div>
      {error && <div>{error}</div>}
      {isLoading ? (
        <Loader className="m-auto" size="2rem" />
      ) : (
        <div
          ref={randomTopicsRef}
          className=" border-amber-200 p-3 sm:p-4 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-400 scrollbar-track-amber-100"
        >
          <div
            className="p-2 sm:p-3 bg-amber-50 rounded-md hover:bg-amber-100 cursor-pointer transition-colors duration-200"
            onClick={() => {
              setsuggestion(randomTopic);
              navigate("/create-story");
            }}
          >
            <p className="text-xs sm:text-sm text-amber-900 font-serif">
              {randomTopic}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RandomTopic;
