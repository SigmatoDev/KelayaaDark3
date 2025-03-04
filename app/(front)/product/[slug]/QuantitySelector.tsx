// components/QuantitySelector.js
"use client";

import { useState } from "react";

const QuantitySelector = () => {
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity(quantity + 1);
  const decrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div className="flex border p-2 rounded-md gap-4 items-center">
      <button className="text-lg" onClick={decrement}>
        -
      </button>
      <span>{quantity}</span>
      <button className="text-lg" onClick={increment}>
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
