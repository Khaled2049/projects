import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface ColonoscopyPrepFormInputs {
  name: string;
  dob: string;
  medications: string;
  allergies: string;
  familyHistory: string;
}

const ColonoscopyPrepForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ColonoscopyPrepFormInputs>();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ColonoscopyPrepFormInputs> = (data) => {
    console.log(data);
    navigate("/options");
  };

  return (
    <div className="w-96 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Enter your information</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            {...register("name")}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.name ? "border-red-500" : ""
            }`}
            id="name"
            type="text"
            placeholder="Your name"
          />
          {errors.name && (
            <p className="text-red-500 text-xs italic">Name is required.</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dob"
          >
            Date of Birth
          </label>
          <input
            {...register("dob")}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.dob ? "border-red-500" : ""
            } appearance-none`}
            id="dob"
            type="date"
          />
          {errors.dob && (
            <p className="text-red-500 text-xs italic">
              Date of Birth is required.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="medications"
          >
            Current Medications
          </label>
          <textarea
            {...register("medications")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="medications"
            placeholder="List any current medications"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="allergies"
          >
            Allergies
          </label>
          <textarea
            {...register("allergies")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="allergies"
            placeholder="List any known allergies"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="familyHistory"
          >
            Family Medical History
          </label>
          <textarea
            {...register("familyHistory")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="familyHistory"
            placeholder="Any relevant family medical history"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default ColonoscopyPrepForm;