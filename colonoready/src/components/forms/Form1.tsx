import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useOutletContext } from "react-router-dom";

interface FormStep1Inputs {
  name: string;
}

const FormStep1: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormStep1Inputs>();

  const { nextStep } = useOutletContext<{
    nextStep: (data: FormStep1Inputs) => void;
  }>();

  const onSubmit: SubmitHandler<FormStep1Inputs> = (data) => {
    nextStep(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 bg-white shadow-md rounded-lg"
    >
      <h2 className="text-2xl font-bold mb-6">Step 1</h2>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Name
        </label>
        <input
          {...register("name", { required: true })}
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
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Next
      </button>
    </form>
  );
};

export default FormStep1;
