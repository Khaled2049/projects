"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  signInWithGoogle,
  signOut,
  onAuthStateChanged,
} from "@/lib/firebase/auth";
import { addFakeRestaurantsAndReviews } from "@/lib/firebase/firestore.js";
import { useRouter } from "next/navigation";
// import { firebaseConfig } from "@/src/lib/firebase/config";

interface User {
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface SignInProps {
  initialUser: User | null;
}

function useUserSession(initialUser: User | null) {
  // The initialUser comes from the server via a server component
  const [user, setUser] = useState(initialUser);
  const router = useRouter();

  // Register the service worker that sends auth state back to server
  // The service worker is built with npm run build-service-worker
  // useEffect(() => {
  //   if ("serviceWorker" in navigator) {
  //     const serializedFirebaseConfig = encodeURIComponent(
  //       JSON.stringify(firebaseConfig)
  //     );
  //     const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`;

  //     navigator.serviceWorker
  //       .register(serviceWorkerUrl)
  //       .then((registration) => console.log("scope is: ", registration.scope));
  //   }
  // }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser: User | null) => {
      setUser(authUser);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onAuthStateChanged((authUser: User | null) => {
      if (user === undefined) return;

      // refresh when user changed to ease testing
      if (user?.email !== authUser?.email) {
        router.refresh();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return user;
}

export default function signIn({ initialUser }: SignInProps) {
  const user = useUserSession(initialUser);

  const handleSignOut = (event: any) => {
    event.preventDefault();
    signOut();
  };

  const handleSignIn = (event: any) => {
    event.preventDefault();
    signInWithGoogle();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {user ? (
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h1 className="text-gray-600 mb-4">NovelSync</h1>
          <img
            className="w-24 h-24 rounded-full mx-auto"
            src={user.photoURL || "../../../public/assets//images/logo.png"}
          />
          <h2 className="mt-4 text-2xl font-semibold">{user.displayName}</h2>
          <p className="text-gray-600">{user.email}</p>
          <button
            onClick={handleSignOut}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h1 className="text-gray-600 mb-4">NovelSync</h1>
          <button
            onClick={handleSignIn}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sign In with Google
          </button>
        </div>
      )}
    </div>
  );
}
