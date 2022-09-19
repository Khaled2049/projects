import React from "react";
import { Link } from "react-router-dom";

interface IClassCard {
  title: string;
  description: string;
  classDetails: any;
}

const ClassCard = ({ title, description, classDetails }: IClassCard) => {
  return (
    <div className="flex flex-col p-3 w-[40rem]">
      <Link
        className="text-blue-600 hover:text-blue-700 transition duration-300 ease-in-out"
        to={classDetails}
      >
        <h1>{title}</h1>
      </Link>
      <p>{description}</p>
    </div>
  );
};

export default ClassCard;
