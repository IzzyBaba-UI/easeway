"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({
  steps,
  currentStep,
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Desktop/Tablet Linear Stepper */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[16px] font-medium text-gray-900">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-[16px] text-gray-600">
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-[#FF3133] h-1.5 rounded-full"
            />
          </div>

          {/* Step Dots */}
          <div className="flex justify-between absolute -top-0.5 w-full">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;

              return (
                <div key={index} className="relative">
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor:
                        isCompleted || isCurrent ? "#FF3133" : "#e5e7eb",
                      scale: isCurrent ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`w-3 h-3 rounded-full flex items-center justify-center border ${
                      isCompleted || isCurrent
                        ? "border-[#FF3133]"
                        : "border-gray-300"
                    } bg-white`}
                  >
                    {isCompleted ? (
                      <Check className="w-2 h-2 text-white" />
                    ) : (
                      <div
                        className={`w-1 h-1 rounded-full ${
                          isCurrent ? "bg-white" : "bg-gray-400"
                        }`}
                      />
                    )}
                  </motion.div>

                  {/* Step Label */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 text-center">
                    <span
                      className={`block truncate text-[14px] font-medium ${
                        isCompleted || isCurrent
                          ? "text-[#FF3133]"
                          : "text-gray-500"
                      }`}
                    >
                      {step.split(" ")[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Stepper */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[16px] font-medium text-gray-900">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-[16px] text-gray-600">
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="bg-[#FF3133] h-1.5 rounded-full"
          />
        </div>

        {/* Current Step Label */}
        <div className="text-center">
          <span className="text-[16px] font-medium text-[#FF3133]">
            {steps[currentStep]}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressStepper;
