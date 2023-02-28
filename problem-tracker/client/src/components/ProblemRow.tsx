import React from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import ProblemList from "./ProblemList";
import ProblemDetails from "./ProblemDetails";
const ProblemRow = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h1>Problems Solved</h1>
          <ProblemList />
          <Button variant="primary">Add</Button>{" "}
        </Col>
        <Col>
          <ProblemDetails />
        </Col>
      </Row>
    </Container>
  );
};

export default ProblemRow;
