import { useEffect, useState } from "react";

const CheckoutSteps = ({ current = 0 }) => {
  const steps = [
    "User Login",
    "Shipping Address",
    "Payment Method",
    "Place Order",
  ];

  const [animatedSteps, setAnimatedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (current > 0 && !animatedSteps.includes(current - 1)) {
      setAnimatedSteps((prev) => [...prev, current - 1]);
    }
  }, [current]);

  return (
    <div className="relative flex justify-between items-center w-full mt-10 px-4">
      {/* Connector line (only between step circles) */}
      <div className="absolute top-[20px] left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-[4px] bg-gray-200 z-0 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#eee] transition-all duration-500 ease-in-out"
          style={{
            width: `${(current / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>

      {/* Step Circles & Labels */}
      {steps.map((label, index) => {
        const isCompleted = current > index;
        const isActive = current === index;

        return (
          <div key={index} className="flex flex-col items-center z-10 flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-medium transition-all duration-300 ${
                isCompleted
                  ? "bg-green-500 text-white"
                  : isActive
                    ? "bg-[#EC4999] text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {isCompleted ? (
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span
              className={`mt-2 text-sm text-center font-semibold transition-colors duration-300 ${
                isCompleted
                  ? "text-green-600"
                  : isActive
                    ? "text-[#EC4999]"
                    : "text-gray-400"
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutSteps;
