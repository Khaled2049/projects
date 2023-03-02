import React, { useContext, useState } from "react";
import CodesContext from "../context/Codes";
import ListGroup from "react-bootstrap/ListGroup";

type Data = {
  Title: String;
  Code: String;
  ID: any;
};

const ProblemList = ({ data }: any) => {
  const { selectProblem } = useContext(CodesContext);

  return (
    <div>
      <h1 className="text-center text-decoration-underline">Problems Solved</h1>
      <ListGroup className="py-4">
        {data.map((p: any) => (
          <ListGroup.Item
            variant="success"
            key={p.ID}
            onClick={() => selectProblem(p.ID)}
            style={{ cursor: "pointer" }}
            className="my-1"
          >
            <span>{p.Title}</span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default ProblemList;
