import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ProgressIndicator from "./components/ProgressIndicator";
import "./index.css";

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const navigate = useNavigate();

  const nextStep = (data: any) => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      navigate(`/step${currentStep + 1}`);
    } else {
      console.log("Form submitted", data);
      // Handle form submission here
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      <Outlet context={{ nextStep }} />
    </div>
  );
};

export default App;
