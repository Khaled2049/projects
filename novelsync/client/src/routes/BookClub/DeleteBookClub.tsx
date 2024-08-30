import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { useBookClub } from "../../contexts/BookClubContext";

const DeleteBookClub: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { deleteBookClub } = useBookClub();
  const history = useHistory();

  const handleDelete = async () => {
    await deleteBookClub(id!);
    history.push("/book-clubs"); // Redirect to book clubs list after deletion
  };

  return (
    <div>
      <p>Are you sure you want to delete this book club?</p>
      <button onClick={handleDelete}>Yes, Delete</button>
    </div>
  );
};

export default DeleteBookClub;
