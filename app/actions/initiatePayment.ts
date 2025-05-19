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

  console.log("Final URL:", `${phonePeHost}/pg/v1/pay`);
  console.log("Headers:", {
    "X-VERIFY": checksum,
    "X-CALLBACK-URL": `${baseUrl}/status/${transactionId}`,
  });

  try {
    const response = await axios.post(
      `${phonePeHost}/pg/v1/pay`,
      { request: dataBase64 },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          "X-CALLBACK-URL": `${baseUrl}/status/${transactionId}`, // optional but recommended
          accept: "application/json",
        },
      }
    );

    const redirectUrl =
      response.data?.data?.instrumentResponse?.redirectInfo?.url;
    console.log("redirectUrl URL:", redirectUrl);

    if (!redirectUrl) throw new Error("Invalid PhonePe response");

    return { redirectUrl, transactionId };
  } catch (error: any) {
    console.error("❌ initiatePayment Error:", error);
    throw new Error("Payment initiation failed");
  }
}
