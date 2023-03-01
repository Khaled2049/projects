import React from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import ProblemList from "./ProblemList";
import ProblemDetails from "./ProblemDetails";
import { Link } from "react-router-dom";
const ProblemRow = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h1>Problems Solved</h1>
          <ProblemList />
          <Link to={"add"}>Add</Link>
        </Col>
        <Col>
          <ProblemDetails />
        </Col>
      </Row>
    </Container>
  );
};

export default ProblemRow;
