import React, { useContext, useState } from "react";
import CodesContext from "../context/Codes";

type Data = {
  Title: String;
  Code: String;
  ID: any;
};

const ProblemList = ({ data }: any) => {
  const { selectProblem } = useContext(CodesContext);

  return (
    <ul>
      {data.map((p: any) => (
        <li key={p.ID} onClick={() => selectProblem(p.ID)}>
          {p.Title}
        </li>
      ))}
    </ul>
  );
};

export default ProblemList;
