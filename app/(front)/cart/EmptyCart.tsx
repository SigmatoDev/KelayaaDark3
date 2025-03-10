import { motion } from "framer-motion";
import Link from "next/link";

const EmptyCart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col items-center justify-center p-6"
    >
      <motion.img
        src="/images/empty-cart.png"
        alt="Empty Cart"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-20 mb-4"
      />
      <p className="mb-3 text-lg font-semibold text-gray-700">
        Your cart is empty 😞
      </p>
      <p className="mb-4 text-sm text-gray-500">
        Looks like you haven’t added anything yet.
      </p>
      <Link href="/">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 text-white bg-pink-500 rounded-md shadow hover:bg-pink-700 transition-all"
        >
          Start Shopping
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default EmptyCart;
