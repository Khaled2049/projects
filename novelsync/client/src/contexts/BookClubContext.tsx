import React, { createContext, useContext, useState, ReactNode } from "react";
import { IBookClub, IClub } from "../types/IClub"; // Define your BookClub type here

interface BookClubContextProps {
  bookClubs: IClub[];
  createBookClub: (club: IClub) => Promise<void>;
  getBookClub: (id: string) => IClub | undefined;
  updateBookClub: (id: string, IClub: IClub) => Promise<void>;
  deleteBookClub: (id: string) => Promise<void>;
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
  const [bookClubs, setBookClubs] = useState<IClub[]>([]);

  const createBookClub = async (club: IClub) => {
    // Logic to add the club to Firebase and update state
    setBookClubs([...bookClubs, club]);
  };

  const getBookClub = (id: string) => {
    return bookClubs.find((club) => club.id === id);
  };

  const updateBookClub = async (id: string, updatedClub: IClub) => {
    // Logic to update the club in Firebase and state
    setBookClubs(
      bookClubs.map((club) => (club.id === id ? updatedClub : club))
    );
  };

  const deleteBookClub = async (id: string) => {
    // Logic to delete the club from Firebase and state
    setBookClubs(bookClubs.filter((club) => club.id !== id));
  };

  return (
    <BookClubContext.Provider
      value={{
        bookClubs,
        createBookClub,
        getBookClub,
        updateBookClub,
        deleteBookClub,
      }}
    >
      {children}
    </BookClubContext.Provider>
  );
};
