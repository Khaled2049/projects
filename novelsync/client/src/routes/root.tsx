// import "../components/style.css";
import { useAuth } from "../contexts/AuthContext";
import { SimpleEditor } from "../components/SimpleEditor";
import Navbar from "../components/Navbar";

const Root: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="app">
      <Navbar />
      {user && (
        <p className="mb-4">Hi! {user?.email} Start your novel today 😊</p>
      )}

      <SimpleEditor />
    </div>
  );
};
export default Root;
