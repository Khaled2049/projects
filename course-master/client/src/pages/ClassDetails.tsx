import React from "react";

const ClassDetails = () => {
  return (
    <div>
      <h1 className="text-3xl text-center m-5">Title</h1>
      <div className="flex flex-col max-w-6xl mx-auto space-y-4 ">
        <div className="w-full h-[40rem] border">Video</div>
        <div className="flex justify-between space-x-5">
          <div className="bg-yellow-500 rounded-lg sm:h-[70vh] py-6 w-full h-[80vh] p-3">
            card 2
          </div>
          <div className="bg-red-500 rounded-lg py-6 w-96 p-3">card 3</div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;
