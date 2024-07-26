import { SimpleEditor } from "../components/SimpleEditor";
import Navbar from "../components/Navbar";

const CreateDocument = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <SimpleEditor />
      </div>
    </>
  );
};

export default CreateDocument;
