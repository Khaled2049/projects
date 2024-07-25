"use client";
import { useState, useRef } from "react";
import { auth } from "@/app/firebase/config";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

const Login = () => {
  const logemailRef = useRef();
  const logpasswordRef = useRef();
  const [user, setUser] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();

    const email = logemailRef.current.value;
    const password = logpasswordRef.current.value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setUser(user);
        console.log(user);
        alert(`Welcome ${user.email} `);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        alert("Successfully logged out");
      })
      .catch((error) => {
        alert("Error logging out");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Log in screen</h1>
        {user ? (
          <div>
            <h1 className="text-xl mb-4">Welcome, {user.email}!</h1>
            <button
              onClick={handleLogout}
              className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
            >
              Log Out
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Enter your email"
              ref={logemailRef}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="Enter your password"
              ref={logpasswordRef}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
            >
              Log In
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
