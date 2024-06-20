import React from "react";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="flex items-center justify-center mb-6">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          className={`w-8 h-8 rounded-full ${
            index < currentStep ? "bg-blue-500" : "bg-gray-300"
          } mx-1 flex items-center justify-center text-white`}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;
