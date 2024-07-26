// import "../components/style.css";
import { useAuth } from "../contexts/AuthContext";
import { SimpleEditor } from "../components/SimpleEditor";
import Navbar from "../components/Navbar";

const Root: React.FC = () => {
  const { user } = useAuth();
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        {user && (
          <p className="mb-4">Hi! {user?.email} Start your novel today 😊</p>
        )}

        <SimpleEditor />
      </div>
    </div>
  );
};
export default Root;
