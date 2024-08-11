import Chapters from "../components/Chapters";

const CreateDocument = () => {
  return (
    <>
      <div className="px-4">
        <Chapters edit={false} />
      </div>
    </>
  );
};

export default CreateDocument;
