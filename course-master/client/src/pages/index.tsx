import React, { Fragment } from "react";
import { Router, RouteComponentProps } from "@reach/router";
/** importing our pages */
import About from "./About";
import Contact from "./Contact";
import Courses from "./Courses";
import Home from "./Home";

const RouterPage = (
  props: { pageComponent: JSX.Element } & RouteComponentProps
) => props.pageComponent;

export default function Pages() {
  return (
    <Router primary={false} component={Fragment}>
      <RouterPage path="/about" pageComponent={<About />} />
      <RouterPage path="/contact" pageComponent={<Contact />} />
      <RouterPage path="/" pageComponent={<Home />} />
      <RouterPage path="/courses" pageComponent={<Courses />} />
    </Router>
  );
}
