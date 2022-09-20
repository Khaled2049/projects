import React from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import ClassCard from "../components/ClassCard";

const Courses = () => {
  const { id } = useParams();
  return (
    <div className="container mx-auto ">
      <span className="underline-offset-8 text-4xl">
        CSCI {id} Natural Language Processing.
      </span>
      <Link
        to={`/create-class`}
        className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
      >
        Create Class
      </Link>
      <div>
        <ClassCard
          title="Class-1"
          description="Short description of what you'll learn from this class"
          classDetails={`/courses/${id}/1`}
        />
      </div>
    </div>
  );
};

export default Courses;
