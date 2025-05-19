"use server";
import { v4 as uuidv4 } from "uuid";
import sha256 from "crypto-js/sha256";
import axios from "axios";

export async function initiatePayment(data: number) {
  const transactionId = "Tr-" + uuidv4().toString().slice(-6);
  const merchantUserId = "MUID-" + uuidv4().toString().slice(-6);
  const amountInPaise = 100 * data;

  const baseUrl = process.env.BASE_URL;
  const merchantId = process.env.MERCHANT_ID;
  const saltKey = process.env.SALT_KEY;
  const saltIndex = process.env.SALT_INDEX;
  const phonePeHost = process.env.PHONEPE_HOST_URL;

  // 🔍 Log all env variables (safely, avoid in production)
  console.log("====== ENVIRONMENT VARIABLES ======");
  console.log("BASE_URL:", baseUrl);
  console.log("MERCHANT_ID:", merchantId);
  console.log("SALT_KEY:", saltKey ? "[SET]" : "[MISSING]");
  console.log("SALT_INDEX:", saltIndex);
  console.log("PHONEPE_HOST_URL:", phonePeHost);
  console.log("===================================");

  const payload = {
    merchantId: merchantId,
    merchantTransactionId: transactionId,
    merchantUserId: merchantUserId,
    amount: amountInPaise,
    redirectUrl: `${baseUrl}/status/${transactionId}`,
    redirectMode: "REDIRECT",
    callbackUrl: `${baseUrl}/status/${transactionId}`,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  console.log("🔧 Payment Payload:", payload);

  const dataPayload = JSON.stringify(payload);
  const dataBase64 = Buffer.from(dataPayload).toString("base64");

  const fullURL = dataBase64 + "/pg/v1/pay" + saltKey;
  const dataSha256 = sha256(fullURL).toString();
  const checksum = dataSha256 + "###" + saltIndex;

  const PAY_API_URL = `${phonePeHost}/pg/v1/pay`;

  console.log("🔐 Base64 Payload:", dataBase64);
  console.log("🔐 Checksum:", checksum);
  console.log("🔗 Final Pay URL:", PAY_API_URL);

  try {
    const response = await axios.post(
      PAY_API_URL,
      { request: dataBase64 },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
        },
      }
    );

    console.log("✅ PhonePe API Response:", response.data);

    return {
      redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
      transactionId,
    };
  } catch (error: any) {
    console.error(
      "❌ Error in initiatePayment:",
      error.response?.data || error.message
    );
    throw new Error("Payment initiation failed");
  }
}
