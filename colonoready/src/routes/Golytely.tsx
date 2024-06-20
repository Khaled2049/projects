import React from "react";

const Golytely: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Golytely</h1>
          <p className="text-lg mt-2">
            Golytely is a bowel preparation solution used before a colonoscopy.
            It cleans out the colon to provide a clear view during the
            procedure.
          </p>
          <p className="text-lg mt-2">
            Follow the instructions provided by your healthcare provider when
            using Golytely. Mix the solution with water and drink it according
            to the schedule.
          </p>
          <p className="text-lg mt-2">
            Common side effects may include nausea, bloating, and abdominal
            discomfort. Contact your healthcare provider if you experience
            severe or persistent side effects.
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

export default Golytely;