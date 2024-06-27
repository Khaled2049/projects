import React from "react";
import Scheduler from "../components/scheduler";

const Root: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <Scheduler />
    </div>
  );
};

export default Root;
