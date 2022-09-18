import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
/** importing our pages */
import About from "./About";
import Contact from "./Contact";
import Courses from "./Courses";
import Home from "./Home";
import Error from "./Error";
import Navbar from "../components/Navbar";
import Course from "../pages/Course";

export default function Pages() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route element={<Home />} path="/"></Route>
        <Route element={<About />} path="/about">
          About
        </Route>
        <Route element={<Contact />} path="/contact">
          Contact
        </Route>
        <Route element={<Courses />} path="/courses">
          Courses
        </Route>
        <Route element={<Course />} path="/courses/:id">
          Course
        </Route>
        <Route path="*" element={<Error />}></Route>
      </Routes>
    </Router>
  );
}
