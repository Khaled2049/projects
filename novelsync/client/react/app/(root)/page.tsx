"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "@/lib/firebase/auth";
import { User } from "firebase/auth";
import Header from "@/components/Header";
import Image from "next/image";
import AddDocumentBtn from "@/components/AddDocumentBtn";

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user: User | null) => {
      if (user) {
        // User is signed in
        console.log("Logged in", user.uid);
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const documents = [];

  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">Notification</div>
      </Header>
      {documents.length > 0 ? (
        <div>test</div>
      ) : (
        <div className="document-list-empty">
          <Image
            src="/assets/icons/doc.svg"
            alt="Empty document list"
            width={40}
            height={40}
            className="mx-auto"
          />
          {user ? (
            <AddDocumentBtn
              userId={user?.uid || ""}
              email={user?.email || ""}
            />
          ) : null}
        </div>
      )}
    </main>

    // <div>
    //   {user ? (
    //     <div>
    //       <p>Signed in as {user.email}</p>
    //       <p>User ID: {user.uid}</p>
    //     </div>
    //   ) : (
    //     <p>User is not signed in.</p>
    //   )}
    // </div>
  );
};

export default Home;
