import React from "react";
import { Container, Navbar, Nav } from "react-bootstrap";

const MyNav = () => {
  return (
    <>
      <Navbar variant="dark" bg="dark" className="justify-content-center">
        <Nav>
          <Nav.Item>
            <Nav.Link eventKey="link-1">Login</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-2">Sign Up</Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar>
    </>
  );
};

export default MyNav;
