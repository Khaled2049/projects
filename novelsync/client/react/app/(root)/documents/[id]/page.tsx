"use client";
import CollaborativeRoom from "@/components/CollaborativeRoom";
import { getDocument } from "@/lib/actions/room.actions";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "@/lib/firebase/auth";

const Document = async ({ params: { id } }: SearchParamProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user: User | null) => {
      if (user) {
        // User is signed in
        console.log("Logged in", user.id);
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
        redirect("/sign-in");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const room = await getDocument({
    roomId: id,
    userId: user?.email || "",
  });

  if (!room) redirect("/");

  // const userIds = Object.keys(room.usersAccesses);
  // const users = [user];

  // const usersData = users.map((user: User) => ({
  //   ...user,
  //   userType: room.usersAccesses[user.email]?.includes("room:write")
  //     ? "editor"
  //     : "viewer",
  // }));

  // const currentUserType = room.usersAccesses[user.email]?.includes("room:write")
  //   ? "editor"
  //   : "viewer";

  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom roomId={id} />
    </main>
  );
};

export default Document;
