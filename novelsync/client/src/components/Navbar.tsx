import { Link } from "react-router-dom";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { signout } = useFirebaseAuth();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signout();
    navigate("/sign-in");
  };

  const handleSignIn = async () => {
    navigate("/sign-in");
  };

  const handleJoinBookClub = async () => {
    navigate("/clubs");
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          <Link to="/">Novel Sync</Link>
        </div>
        <div className="flex space-x-4">
          {/* {user && (
            <button
              onClick={handleJoinBookClub}
              className="bg-amber-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Join a BookClub
            </button>
          )} */}
          {user ? (
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Signout
            </button>
          ) : (
            <button
              onClick={handleSignIn}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Signin
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
