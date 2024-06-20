import { useNavigate } from "react-router-dom";
function Options() {
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
  return (
    <div>
      {" "}
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
    </div>
  );
}

export default Options;
