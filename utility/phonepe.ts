import PhonepeGateway from "phonepepg";

// Optional: Define a type for the constructor if not already available in the `phonepepg` module
const gateway = new PhonepeGateway({
  merchantId: process.env.PHONEPE_MERCHANT_ID!,
  saltKey: process.env.PHONEPE_SALT_KEY!,
  isDev: process.env.NODE_ENV !== "production",
});

export default gateway;
