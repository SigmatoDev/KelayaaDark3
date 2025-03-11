module.exports = {
  extends: "next/core-web-vitals",
  rules: {
    "import/order": "off", // Disabled import order check
    "react/no-unescaped-entities": "off",
    "@next/next/no-img-element": "off", // Only if you want to disable image optimization warnings
  },
};