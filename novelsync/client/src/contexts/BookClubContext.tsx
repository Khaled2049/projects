import React, { createContext, useContext, useState, ReactNode } from "react";
import { IClub } from "../types/IClub"; // Define your BookClub type here

interface BookClubContextProps {
  bookClubs: IClub[];
  createBookClub: (club: IClub) => Promise<void>;
  getBookClub: (id: string) => IClub | undefined;
  updateBookClub: (id: string, IClub: IClub) => Promise<void>;
  deleteBookClub: (id: string) => Promise<void>;
  joinBookClub: (clubId: string, userId: string) => Promise<void>;
  leaveBookClub: (clubId: string, userId: string) => Promise<void>;
}

const BookClubContext = createContext<BookClubContextProps | undefined>(
  undefined
);

export const useBookClub = () => {
  const context = useContext(BookClubContext);
  if (!context) {
    throw new Error("useBookClub must be used within a BookClubProvider");
  }
  return context;
};

export const BookClubProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [bookClubs, setBookClubs] = useState<IClub[]>([
    {
      creatorId: "1",
      id: "1",
      name: "Classic Literature Lovers",
      members: ["Khaled", "Jane Doe", "John Doe"],
      description:
        "Dive into the world of classic literature with fellow book enthusiasts.",
      category: "Classics",
      activity: "Very Active",
      image: "/api/placeholder/400/250",
      bookOfTheMonth: {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        description:
          "Austen's best-loved tale of love, marriage, and society in class-conscious Georgian England.",
      },
      meetUp: "Every Saturday at 3pm virtually",
    },
  ]);

  const createBookClub = async (club: IClub) => {
    console.log("club", club);
    setBookClubs([...bookClubs, club]);
  };

  const getBookClub = (id: string) => {
    return bookClubs.find((club) => club.id === id);
  };

  const updateBookClub = async (id: string, updatedClub: IClub) => {
    setBookClubs(
      bookClubs.map((club) => (club.id === id ? updatedClub : club))
    );
  };

  const deleteBookClub = async (id: string) => {
    setBookClubs(bookClubs.filter((club) => club.id !== id));
  };

  const joinBookClub = async (clubId: string, userId: string) => {
    setBookClubs(
      bookClubs.map((club) =>
        club.id === clubId
          ? { ...club, members: [...club.members, userId] }
          : club
      )
    );
  };

  const leaveBookClub = async (clubId: string, userId: string) => {
    setBookClubs(
      bookClubs.map((club) =>
        club.id === clubId
          ? { ...club, members: club.members.filter((id) => id !== userId) }
          : club
      )
    );
  };

  return (
    <BookClubContext.Provider
      value={{
        bookClubs,
        createBookClub,
        getBookClub,
        updateBookClub,
        deleteBookClub,
        joinBookClub,
        leaveBookClub,
      }}
    >
      {children}
    </BookClubContext.Provider>
  );
};
