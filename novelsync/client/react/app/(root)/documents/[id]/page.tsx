import CollaborativeRoom from "@/components/CollaborativeRoom";
import { getDocument } from "@/lib/actions/room.actions";
import { redirect } from "next/navigation";

// TODO getUser data
const Document = async ({ params: { id } }: SearchParamProps) => {
  // const user = {
  //   uid: "123",
  //   displayName: "John Doe",
  //   email: "1@2.com",
  //   photoURL: "https://example.com/avatar.png",
  // };
  // if (!user) redirect("/sign-in");

  // const room = await getDocument({
  //   roomId: id,
  //   userId: user.email,
  // });

  // if (!room) redirect("/");

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
