import React, { useContext, useState, useEffect } from "react";
import CodesContext from "../context/Codes";
import { GetCode } from "../api";

type CodeType = {
  CodeBody: String;
  CodeComment: String;
  CreatedAt: String;
  CreatedBy: String;
  DeletedAt: String;
  ID: String;
  ProblemDesc: String;
  Title: String;
  UpdatedAt: String;
};

const ProblemDetails = () => {
  const { id } = useContext(CodesContext);
  const [data, setdata] = useState<CodeType>();
  useEffect(() => {
    GetCode(id).then((response) => {
      setdata(response.data.codes);
    });
  }, [id]);

  return (
    <div>
      {data?.Title != "" && (
        <div>
          <div className="text-center">
            <h1 className="text-decoration-underline">{data?.Title}</h1>
          </div>
          <div className="my-5">
            <h4>Description</h4>
            <p>{data?.ProblemDesc}</p>
          </div>
          <div className="my-5">
            <h4>Code</h4>
            <p>{data?.CodeBody}</p>
          </div>
          <div className="my-5">
            <h4>Discussion</h4>
            <p>{data?.CodeComment}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemDetails;
