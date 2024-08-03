import DigitalTimer from "../components/Timer";
import Suggestions from "../components/Suggestions";
import Chapters from "../components/Chapters";

const CreateDocument = () => {
  return (
    <>
      <div className="container mx-auto px-4 flex">
        <div className="px-4">
          <Chapters />
        </div>

        <div className="pl-4">
          <DigitalTimer />
          <Suggestions />
        </div>
      </div>
    </>
  );
};

export default CreateDocument;
