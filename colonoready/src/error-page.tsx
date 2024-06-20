import { useRouteError } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React from "react";

const ErrorPage: React.FC = () => {
  const error: any = useRouteError();
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  console.error(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-lg text-gray-700 mb-4">
          Sorry, an unexpected error has occurred.
        </p>
        <p className="text-gray-500 mb-6">
          <i>{error.statusText || error.message}</i>
        </p>
        <button
          onClick={goHome}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
