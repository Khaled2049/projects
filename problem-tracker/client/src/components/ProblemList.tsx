import React, { useContext, useState } from "react";
import CodesContext from "../context/Codes";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import { DeleteCode } from "../api";

const ProblemList = ({ data }: any) => {
  const { selectProblem } = useContext(CodesContext);
  const numberOfProblemsCompleted = data.length + 1;
  const [completed, setcompleted] = useState(numberOfProblemsCompleted);

  const handleDelete = (event: any) => {
    event.preventDefault();
    try {
      DeleteCode(event.target.value);
    } catch (err: any) {
      return err;
    }
  };

  return (
    <div>
      <h1 className="text-center text-decoration-underline">
        Problems Solved {completed}
      </h1>
      <ListGroup className="py-4">
        {data.map((p: any) => (
          <ListGroup.Item
            variant="success"
            key={p.ID}
            onClick={() => selectProblem(p.ID)}
            style={{ cursor: "pointer" }}
            className="my-1"
          >
            <div style={{ display: "flex" }}>
              <span className="fs-3">{p.Title}</span>
              <div style={{ marginLeft: "auto" }}>
                <Button variant="outline-primary">EDIT</Button>{" "}
                <Button
                  variant="outline-danger"
                  value={p.ID}
                  onClick={handleDelete}
                >
                  DELETE
                </Button>{" "}
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default ProblemList;
