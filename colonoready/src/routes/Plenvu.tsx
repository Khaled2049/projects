import React, { useState } from "react";
import { Outlet, useNavigate, Form } from "react-router-dom";
import DropdownComponent from "../components/DropDownComponent";

const Plenvu: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
        <div className="mb-8 ">
          <h1 className="text-3xl font-bold">Plenvu</h1>
          <p className="text-lg mt-2">
            Plenvu is a bowel preparation solution used before colonoscopy to
            clean out the colon. It helps ensure that the colonoscopy procedure
            is effective by providing a clear view of the colon lining.
          </p>
          <p className="text-lg mt-2">
            Before using Plenvu, it's important to follow the instructions
            provided by your healthcare provider. It usually involves mixing the
            solution with water and drinking it according to a specific
            schedule. Make sure to stay hydrated during the process.
          </p>
          <p className="text-lg mt-2">
            Common side effects of Plenvu may include nausea, vomiting,
            bloating, and abdominal discomfort. If you experience severe or
            persistent side effects, contact your healthcare provider.
          </p>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Select Plenvu Colonoscopy Procedure date
          </button>

          <button
            className="text-red-500 hover:underline focus:outline-none border-2 px-4 py-2 rounded-lg"
            type="button"
            onClick={() => {
              navigate(-1);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      {/* <div className="max-w-lg mx-auto p-6 mt-6 bg-white shadow-md rounded-lg">
        <div className="mb-8 ">
          <h1 className="text-3xl font-bold">FAQ</h1>
          <p className="text-lg mt-2">
            <strong>Q:</strong> How long does it take for Plenvu to start
            working?
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default Plenvu;
