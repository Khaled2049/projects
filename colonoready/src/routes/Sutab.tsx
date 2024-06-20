import React from "react";

const Sutab: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Sutab</h1>
          <p className="text-lg mt-2">
            Sutab is a medication used for bowel preparation before a
            colonoscopy. It helps to clean out the colon to provide a clear view
            during the procedure.
          </p>
          <p className="text-lg mt-2">
            Follow your doctor's instructions carefully when using Sutab. It
            usually involves taking the tablets with water according to a
            specific schedule. Ensure to stay well-hydrated throughout the
            process.
          </p>
          <p className="text-lg mt-2">
            Common side effects may include nausea, abdominal discomfort, and
            bloating. Contact your healthcare provider if you experience severe
            or persistent side effects.
          </p>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sutab;
