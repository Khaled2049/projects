import React from "react";
import { Link } from "react-router-dom";

const Courses = () => {
  return (
    <div className="container">
      <div className="mx-[4rem] sm:mx-[8rem] md:mx-[14rem] flex flex-col sm:w-screen md:w-2/5">
        <h1 className="underline text-2xl my-2">Course List</h1>
        <h1 className="text-lg font-bold">Semester - 1 Spring 2022</h1>
        <Link
          className="text-blue-600 hover:text-blue-700 transition duration-300 ease-in-out mb-4"
          to="/courses/5722"
        >
          CSCI 5722 Computer Vision
        </Link>
        <h1 className="text-lg font-bold">Semester - 2 Fall 2022</h1>
        <Link
          className="text-blue-600 hover:text-blue-700 transition duration-300 ease-in-out mb-4"
          to="/courses/5832"
        >
          CSCI 5832 Natural Language Processing
        </Link>
        <Link
          className="text-blue-600 hover:text-blue-700 transition duration-300 ease-in-out mb-4"
          to="/courses/5922"
        >
          CSCI 5922 Neural Networks and Deep Learning
        </Link>
        <h1 className="text-lg font-bold">Semester - 3 Spring 2023</h1>
        <Link
          className="text-blue-600 hover:text-blue-700 transition duration-300 ease-in-out mb-4"
          to="/courses/5673"
        >
          CSCI 5673 Distributed Systems
        </Link>
        <Link
          className="text-blue-600 hover:text-blue-700 transition duration-300 ease-in-out mb-4"
          to="/courses/5273"
        >
          CSCI 5273 Network Systems
        </Link>
        <h1 className="text-lg font-bold">Semester - 4 Summer 2023</h1>
        <Link
          className="text-blue-600 hover:text-blue-700 transition duration-300 ease-in-out mb-4"
          to="/courses/5502"
        >
          {" "}
          CSCI 5502 Data Mining
        </Link>
        <h1 className="text-lg font-bold">Semester - 5 Fall 2023</h1>
        <Link
          className="text-blue-600 hover:text-blue-700 transition duration-300 ease-in-out mb-4"
          to="/courses/5454"
        >
          CSCI 5454 Design and Analysis of Algorithms
        </Link>
        <Link
          className="text-blue-600 hover:text-blue-700 transition duration-300 ease-in-out mb-4"
          to="/courses/5302"
        >
          CSCI 5302 Advanced Robotics
        </Link>
        <h1 className="text-lg font-bold">Semester - 6 Spring 2024</h1>
        <Link
          className="text-blue-600 hover:text-blue-700 transition duration-300 ease-in-out mb-4"
          to="/courses/5403"
        >
          CSCI 5403 Intro to Cyber Security
        </Link>
        <Link
          className="text-blue-600 hover:text-blue-700 transition duration-300 ease-in-out mb-4"
          to="/courses/5413"
        >
          CSCI 5413 Ethical Hacking
        </Link>
      </div>
    </div>
  );
};

export default Courses;
