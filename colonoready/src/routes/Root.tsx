import React from "react";

import ColonoscopyPrepForm from "./ColonoscopyPrepForm";
import { Outlet, useLocation } from "react-router-dom";

const Root: React.FC = () => {
  const location = useLocation();
  const showForm = location.pathname === "/";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">
        Colonoscopy Procedure Prep Forms
      </h1>

      {showForm && <ColonoscopyPrepForm />}
      <Outlet />
    </div>
  );
};

export default Root;
