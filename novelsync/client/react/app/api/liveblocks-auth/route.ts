import { useEffect, useState } from "react";
import { liveblocks } from "@/lib/liveblocks";
import { onAuthStateChanged } from "@/lib/firebase/auth";
import { User } from "firebase/auth";
import { redirect } from "next/navigation";
import { getUserColor } from "@/lib/utils";

// TODO getUser data
export async function POST(request: Request) {
  // const [user, setUser] = useState<User | null>(null);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged((user: User | null) => {
  //     if (user) {
  //       setUser(user);
  //     } else {
  //       redirect("/sign-in");
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  const user = {
    uid: "btwiOF71xOeD3eswvpJuZg8QQb23",
    displayName: "Khaled Hossain",
    email: "khaledhossain.not@gmail.com",
    photoURL:
      "https://lh3.googleusercontent.com/a/ACg8ocKPsdRuRszkX2YVHgZRK75rkcXW7AUo09oQJVbxLZPTQIfvqFCI=s96-c",
  };

  const { uid, displayName, email, photoURL } = user;

  const liveblocksUser = {
    id: uid,
    info: {
      id: uid,
      name: displayName,
      email: email,
      avatar: photoURL,
      color: getUserColor(uid),
    },
  };

  // Identify the user and return the result
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: liveblocksUser.info.email!,
      groupIds: [],
    },
    { userInfo: liveblocksUser?.info }
  );

  return new Response(body, { status });
}
