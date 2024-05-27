import React from "react";
import { SignIn } from "../components/sign-in";

const SignInPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SignIn />
    </div>
  );
};

export default SignInPage;
