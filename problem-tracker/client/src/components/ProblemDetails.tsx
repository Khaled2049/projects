import React, { useContext } from "react";
import CodesContext from "../context/Codes";
type ID = {
  id: String;
};

const ProblemDetails = () => {
  const { id } = useContext(CodesContext);

  return (
    <div>
      <h1>Name</h1>
      <div>{id}</div>
    </div>
  );
};

export default ProblemDetails;
