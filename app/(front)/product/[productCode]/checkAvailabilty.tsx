import { CheckCircle, AlertCircle, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AvailabilityChecker({ product }: { product: any }) {
  const [showPopup, setShowPopup] = useState(false);
  const [checking, setChecking] = useState(false);
  const [latestAvailable, setLatestAvailable] = useState<boolean | null>(null);

  const handleCheck = async () => {
    setChecking(true);
    setShowPopup(false);

    try {
      const res = await fetch("/api/products/by-productcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productCode: product.productCode }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch product");
      }

      const data = await res.json();
      const isAvailable = parseInt(data?.countInStock || "0") > 0;

      setLatestAvailable(isAvailable);

      setTimeout(() => {
        setChecking(false);
        setShowPopup(true);

        setTimeout(
          () => {
            setShowPopup(false);
          },
          isAvailable ? 2000 : 5000
        ); // ⏱️ 2s if available, 5s if not
      }, 1500);
    } catch (error) {
      console.error("❌ Error checking product availability:", error);
      setChecking(false);
      setLatestAvailable(false);
      setShowPopup(true);

      // Optional: auto-close even on fetch error
      setTimeout(() => {
        setShowPopup(false);
      }, 5000);
    }
  };

  return (
    <div className="relative">
      <button
        className="bg-[#FFF6F8] text-pink-500 text-[12px] px-6 py-2 font-semibold rounded-none w-full flex justify-center items-center"
        onClick={handleCheck}
        disabled={checking}
      >
        {checking ? (
          <motion.span
            className="flex gap-1 text-pink-500"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2,
                  repeat: Infinity,
                  repeatType: "loop",
                },
              },
            }}
          >
            <span>Checking stocks</span>
            <motion.span
              className="dot"
              variants={{
                hidden: { opacity: 0.2 },
                visible: { opacity: 1 },
              }}
            >
              •
            </motion.span>
            <motion.span
              className="dot"
              variants={{
                hidden: { opacity: 0.2 },
                visible: { opacity: 1 },
              }}
            >
              •
            </motion.span>
            <motion.span
              className="dot"
              variants={{
                hidden: { opacity: 0.2 },
                visible: { opacity: 1 },
              }}
            >
              •
            </motion.span>
          </motion.span>
        ) : (
          "CHECK AVAILABILITY"
        )}
      </button>

      <AnimatePresence>
        {showPopup && latestAvailable !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`absolute z-50 top-full mt-2 left-0 right-0 mx-auto max-w-sm p-4 rounded-md shadow-lg text-sm font-medium ${
              latestAvailable
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            <div className="flex justify-between items-start space-x-2">
              <div className="flex items-start space-x-2">
                {latestAvailable ? (
                  <CheckCircle className="w-5 h-5 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 mt-0.5" />
                )}
                <div>
                  {latestAvailable ? (
                    <p>This product is available and ready to ship!</p>
                  ) : (
                    <>
                      <p>Currently out of stock.</p>
                      <p className="text-xs mt-1">
                        We're really sorry! Please reach out or check back later
                        — we'd love to help you find something just right 💖
                      </p>
                    </>
                  )}
                </div>
              </div>

              {!latestAvailable && (
                <button
                  className="ml-auto text-yellow-700 hover:text-yellow-900"
                  onClick={() => setShowPopup(false)}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
