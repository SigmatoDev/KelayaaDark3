"use server";
import { v4 as uuidv4 } from "uuid";
import sha256 from "crypto-js/sha256";
import axios from "axios";

export async function initiatePayment(amount: number) {
  const transactionId = "Tr-" + uuidv4().slice(-6);
  const merchantUserId = "MUID-" + uuidv4().slice(-6);
  const amountInPaise = amount * 100;

  const baseUrl = process.env.BASE_URL!;
  const merchantId = process.env.MERCHANT_ID!;
  const saltKey = process.env.SALT_KEY!;
  const saltIndex = process.env.SALT_INDEX!;
  const phonePeHost = process.env.PHONEPE_HOST_URL!;

  if (!baseUrl || !merchantId || !saltKey || !saltIndex || !phonePeHost) {
    console.error("❌ Missing environment variables");
    throw new Error("Missing environment variables");
  }

  const payload = {
    merchantId,
    merchantTransactionId: transactionId,
    merchantUserId,
    amount: amountInPaise,
    redirectUrl: `${baseUrl}/status/${transactionId}`,
    redirectMode: "REDIRECT",
    callbackUrl: `${baseUrl}/status/${transactionId}`,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const dataPayload = JSON.stringify(payload);
  const dataBase64 = Buffer.from(dataPayload).toString("base64");

  const stringToHash = dataBase64 + "/pg/v1/pay" + saltKey;
  const checksum = sha256(stringToHash).toString() + "###" + saltIndex;

  console.log("✅ Payment Payload (JSON):", payload);
  console.log("📦 Base64 Payload:", dataBase64);
  console.log("🔑 String to Hash:", stringToHash);
  console.log("✅ Final Checksum:", checksum);
  console.log("🌍 Endpoint URL:", `${phonePeHost}/pg/v1/pay`);

  const headers = {
    "Content-Type": "application/json",
    accept: "application/json",
    "X-VERIFY": checksum,
    "X-CALLBACK-URL": `${baseUrl}/status/${transactionId}`,
  };

  console.log("📨 Headers Sent:", headers);

  try {
    const response = await axios.post(
      `${phonePeHost}/pg/v1/pay`,
      { request: dataBase64 },
      { headers }
    );

    console.log("✅ PhonePe API Response Status:", response.status);
    console.log("📩 PhonePe API Response Data:", response.data);

    const redirectUrl =
      response.data?.data?.instrumentResponse?.redirectInfo?.url;

    if (!redirectUrl) {
      console.error("❌ No redirectUrl found in response");
      console.debug("➡ Full response data:", response.data);
      throw new Error("Invalid PhonePe response");
    }

    return { redirectUrl, transactionId };
  } catch (error: any) {
    if (error.response) {
      console.error("❌ PhonePe API Error Response:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.error("❌ PhonePe API No Response:", error.request);
    } else {
      console.error("❌ PhonePe API General Error:", error.message);
    }

    throw new Error("Payment initiation failed");
  }
}
