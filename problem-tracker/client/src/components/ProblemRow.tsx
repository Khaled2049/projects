import React, { useState, useEffect } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import ProblemList from "./ProblemList";
import ProblemDetails from "./ProblemDetails";
import { Link } from "react-router-dom";
import axios from "axios";

const ProblemRow = () => {
  const [data, setdata] = useState<any>([]);
  useEffect(() => {
    axios.get("http://localhost:3000/code").then((response) => {
      setdata(response.data.codes);
    });
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <h1>Problems Solved</h1>
          <ProblemList data={data} />
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
