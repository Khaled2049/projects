import React, { useState, useEffect } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import ProblemList from "./ProblemList";
import ProblemDetails from "./ProblemDetails";
import { Link } from "react-router-dom";
import { GetCodes } from "../api";

const ProblemRow = () => {
  const [data, setdata] = useState<any>([]);
  useEffect(() => {
    GetCodes().then((response) => {
      setdata(response.data.codes);
    });
  }, []);

  return (
    <Container>
      <Row className="mt-5">
        <Col>
          <ProblemList data={data} />
          <Link to={"add"}>
            <Button size="lg" variant="primary">
              Add
            </Button>
          </Link>
        </Col>
        <Col>
          <ProblemDetails />
        </Col>
      </Row>
    </Container>
  );
};

export default ProblemRow;
