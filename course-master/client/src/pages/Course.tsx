import React from "react";
import { useParams } from "react-router-dom";

import ClassCard from "../components/ClassCard";

const Courses = () => {
  const { id } = useParams();
  return (
    <div className="container mx-auto">
      <span className="underline-offset-8 text-4xl">
        CSCI {id} Natural Language Processing.
      </span>

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
