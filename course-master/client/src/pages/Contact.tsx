import React from "react";
import { GrGithub, GrLinkedinOption, GrMail } from "react-icons/gr";
const Contact = () => {
  return (
    <div>
      {" "}
      <div className="mt-4">
        <div className="flex flex-col mx-auto space-y-4 ">
          <div className="flex items-center justify-center ">
            <div className="grid place-items-center rounded-lg ">
              <img
                className="w-64 rounded-full mr-4 text-center"
                src="../../public/me.jpg"
              />
            </div>
            <div className="flex flex-row space-x-4">
              <GrLinkedinOption className="text-[5rem]" />
              <GrGithub className="text-[5rem]" />
              <GrMail className="text-[5rem]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
