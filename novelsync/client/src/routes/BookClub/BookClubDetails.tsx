import React from "react";
import { useParams } from "react-router-dom";
import { useBookClub } from "../../contexts/BookClubContext";

const BookClubDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBookClub } = useBookClub();
  const club = getBookClub(id!);

  if (!club) {
    return <div>Club not found</div>;
  }

  return (
    <div>
      <h1>{club.name}</h1>
      <p>{club.description}</p>
    </div>
  );
};

export default BookClubDetails;
