import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useBookClub } from "../../contexts/BookClubContext";
import { BookClub } from "../types";

const UpdateBookClub: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBookClub, updateBookClub } = useBookClub();
  const club = getBookClub(id!);
  const [name, setName] = useState(club?.name || "");
  const [description, setDescription] = useState(club?.description || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (club) {
      const updatedClub: BookClub = { ...club, name, description };
      await updateBookClub(id!, updatedClub);
    }
  };

  if (!club) {
    return <div>Club not found</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Update Club</button>
    </form>
  );
};

export default UpdateBookClub;
