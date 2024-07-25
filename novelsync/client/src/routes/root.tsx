// import "../components/style.css";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { SimpleEditor } from "../components/SimpleEditor";

const Root: React.FC = () => {
  const { signout } = useFirebaseAuth();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signout();
    navigate("/sign-in");
  };
  return (
    <div className="app">
      <h1></h1>
      {user && (
        <p className="mb-4">Hi! {user?.email} Start your novel today 😊</p>
      )}
      <button
        onClick={handleSignOut}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Sign Out
      </button>
      <SimpleEditor />
    </div>
  );
};
export default Root;
