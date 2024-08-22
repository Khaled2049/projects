import { Link } from "react-router-dom";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import { User } from "lucide-react";

const Navbar = () => {
  const { signout } = useFirebaseAuth();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signout();
    navigate("/sign-in");
  };

  const handleSignIn = async () => {
    navigate("/sign-in");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          <Link to="/">Novel Sync</Link>
        </div>
        <div className="flex space-x-4 items-center">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <User className="w-8 h-8 rounded-full" /> // Use the User icon as a fallback
                )}
                <span>{user.displayName || "User"}</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg z-50">
                  <Link
                    to="/user-stories"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Your Stories
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
