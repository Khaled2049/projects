"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import { Editor } from "@/components/editor/Editor";

const CollaborativeRoom = ({ roomId }: any) => {
  const currentUserType = "editor";

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<div>Loading…</div>}>
        <div className="collaborative-room">
          <Editor roomId={roomId} currentUserType={currentUserType} />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default CollaborativeRoom;
