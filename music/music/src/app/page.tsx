"use client";
import React, { useEffect, useState } from "react";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";

const Home = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <div>Welcome, {user.displayName || user.email}!</div>
      ) : (
        <div>Please sign in.</div>
      )}
    </div>
  );
};

export default Home;
