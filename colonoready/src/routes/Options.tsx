import { useNavigate } from "react-router-dom";
function Options() {
  const navigate = useNavigate();

  const handleOptionClick = (option: string) => {
    navigate(`${option}`);
  };

  const options = [
    { name: "Plenvu", url: "plenvu" },
    { name: "Sutab", url: "sutab" },
    { name: "Miralax-Gatorade", url: "miralaxg" },
    { name: "Golytely", url: "golytely" },
    { name: "Golytely Two Day Prep", url: "golytelytwodayprep" },
  ];
  return (
    <div>
      {" "}
      <div className="space-y-4 flex flex-col">
        {options.map((option) => (
          <button
            key={option.url}
            onClick={() => handleOptionClick(option.url)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Options;
