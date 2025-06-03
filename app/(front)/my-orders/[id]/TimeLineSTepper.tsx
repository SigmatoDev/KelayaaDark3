import { motion } from "framer-motion";
import clsx from "clsx";
import { FaCheckCircle, FaClock } from "react-icons/fa";

const circleVariants = {
  inactive: {
    scale: 1,
    backgroundColor: "#F3F4F6",
    borderColor: "#D1D5DB",
  },
  active: {
    scale: 1.15,
    backgroundColor: "#BBF7D0",
    borderColor: "#22C55E",
  },
};

const lineVariants = {
  inactive: {
    background:
      "repeating-linear-gradient(90deg, #D1D5DB, #D1D5DB 4px, transparent 4px, transparent 8px)",
  },
  active: {
    backgroundColor: "#22C55E",
  },
};

const verticalLineVariants = {
  inactive: {
    background:
      "repeating-linear-gradient(0deg, #D1D5DB, #D1D5DB 4px, transparent 4px, transparent 8px)",
  },
  active: {
    backgroundColor: "#22C55E",
  },
};

interface StatusHistoryItem {
  status: string;
  note: string;
  changedAt: string;
}

export default function TimelineStepper({
  statuses,
  currentStep,
  statusHistory,
}: {
  statuses: string[];
  currentStep: number; // zero-based index
  statusHistory?: StatusHistoryItem[];
}) {
  const normalize = (s: string) => s.toLowerCase().replace(/[\s-]/g, "");

  // Map statusHistory by normalized status
  const historyMap = new Map(
    (statusHistory || []).map(({ status, note, changedAt }) => [
      normalize(status),
      { note, changedAt },
    ])
  );

  return (
    <div
      className="relative flex flex-col md:flex-row items-start md:items-center w-full justify-between"
      style={{ minHeight: 100 }}
    >
      {statuses.map((status, idx) => {
        const isActive = idx <= currentStep;
        const isCurrent = idx === currentStep;
        const isLast = idx === statuses.length - 1;

        const normalizedStatus = normalize(status);
        const historyItem = historyMap.get(normalizedStatus);

   
        return (
          <div
            key={status}
            className={clsx(
              "relative flex items-center md:flex-col md:items-center z-10",
              !isLast ? "mb-8 md:mb-0" : ""
            )}
            style={{ minWidth: 60 }}
          >
            {/* Step circle */}
            <motion.div
              initial="inactive"
              animate={isActive ? "active" : "inactive"}
              variants={circleVariants}
              transition={{ duration: 0.3 }}
              className={clsx(
                "w-8 h-8 rounded-full border-4 flex items-center justify-center",
                isActive ? "border-green-400" : "border-gray-300",
                "cursor-default shadow-sm"
              )}
              aria-current={isCurrent ? "step" : undefined}
              aria-label={status}
            >
              {isActive ? (
                <FaCheckCircle
                  className={clsx(
                    "text-green-600",
                    isCurrent ? "animate-pulse" : ""
                  )}
                  size={16}
                />
              ) : (
                <FaClock className="text-gray-400" size={16} />
              )}
            </motion.div>

            {/* Label and date with tooltip on desktop */}
            <div className="ml-3 md:ml-0 md:mt-2 flex flex-col items-start md:items-center whitespace-nowrap">
              {/* Desktop: status label with tooltip showing note and date */}
              <div className="hidden md:block relative group cursor-help select-none">
                <span
                  className={clsx(
                    "text-xs font-medium",
                    isActive ? "text-green-700" : "text-gray-400"
                  )}
                >
                  {status}
                </span>

                {/* Tooltip */}
                {historyItem && (
                  <div
                    role="tooltip"
                    className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-gray-800 text-white text-xs rounded-md p-2 pointer-events-none z-50"
                  >
                    <div className="font-semibold">{status}</div>
                    <div className="italic text-gray-300 mt-1 break-words whitespace-normal">
                      {historyItem.note}
                    </div>

                    <div className="text-gray-400 mt-1 text-[10px]">
                      {new Date(historyItem.changedAt).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile: show note below status label */}
              {historyItem && (
                <div
                  className="mt-1 italic text-gray-500 text-xs text-left md:hidden break-words whitespace-normal"
                  aria-label={`Note: ${historyItem.note}, Date: ${new Date(historyItem.changedAt).toLocaleString()}`}
                >
                  {historyItem.note}
                  <br />

                  <span className="text-gray-400 text-[10px]">
                    {new Date(historyItem.changedAt).toLocaleDateString(
                      "en-GB"
                    ) +
                      " , " +
                      new Date(historyItem.changedAt).toLocaleTimeString(
                        "en-US",
                        { hour: "2-digit", minute: "2-digit", hour12: true }
                      )}
                  </span>
                </div>
              )}

              {/* Mobile: status label */}
              <span
                className={clsx(
                  "text-xs font-medium md:hidden",
                  isActive ? "text-green-700" : "text-gray-400"
                )}
              >
                {status}
              </span>
            </div>

            {/* Vertical line for mobile/tablet */}
            {!isLast && (
              <motion.div
                className="md:hidden absolute left-3 top-full w-1 h-10 rounded-full"
                initial="inactive"
                animate={idx < currentStep ? "active" : "inactive"}
                variants={verticalLineVariants}
                transition={{ duration: 0.4 }}
              />
            )}
          </div>
        );
      })}

      {/* Horizontal lines for desktop - placed between steps */}
      {statuses.map((_, idx) => {
        if (idx === statuses.length - 1) return null;
        const isActive = idx < currentStep;

        return (
          <motion.div
            key={`connector-${idx}`}
            className="hidden md:block absolute h-1 bg-gray-300 rounded-full"
            initial="inactive"
            animate={isActive ? "active" : "inactive"}
            variants={lineVariants}
            transition={{ duration: 0.4 }}
            style={{
              top: "35%",
              transform: "translateY(-50%)",
              left: `calc((100% / ${statuses.length - 1}) * ${idx} + 16px)`,
              width: `calc(100% / ${statuses.length - 1} - 36px)`,
            }}
          />
        );
      })}
    </div>
  );
}
