import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
/** importing our pages */
import Contact from "./Contact";
import Courses from "./Courses";
import Home from "./Home";
import Error from "./Error";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CreateClass from "../components/CreateClass";
import Course from "../pages/Course";
import ClassDetails from "./ClassDetails";

export default function Pages() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route element={<Home />} path="/"></Route>
        <Route element={<Contact />} path="/contact">
          Contact
        </Route>
        <Route element={<Courses />} path="/courses">
          Courses
        </Route>
        <Route element={<Course />} path="/courses/:id">
          Course
        </Route>
        <Route element={<CreateClass />} path="/create-class">
          Create Class
        </Route>
        <Route element={<ClassDetails />} path="/courses/:id/:cid">
          Class Details
        </Route>
        <Route path="*" element={<Error />}></Route>
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}
