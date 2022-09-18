import React from "react";
import { useParams } from "react-router-dom";
const Courses = () => {
  const { id } = useParams();
  return <div>Course {id}</div>;
};

export default Courses;
