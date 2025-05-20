"use server";
import { v4 as uuidv4 } from "uuid";
import sha256 from "crypto-js/sha256";
import axios from "axios";

export async function initiatePayment(data: number) {
  const transactionId = "Tr-" + uuidv4().toString().slice(-6);

  const payload = {
    merchantId: process.env.PHONEPE_MERCHANT_ID,
    merchantTransactionId: transactionId,
    merchantUserId: "MUID-" + uuidv4().toString().slice(-6),
    amount: 100 * data,
    redirectUrl: `${process.env.PBASE_URL}/status/${transactionId}`,
    redirectMode: "REDIRECT",
    callbackUrl: `${process.env.PBASE_URL}/status/${transactionId}`,
    mobileNumber: "9876543210",
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const jsonPayload = JSON.stringify(payload);
  const base64Payload = Buffer.from(jsonPayload).toString("base64");

  const path = "/pg/v1/pay";
  const toHash = base64Payload + path + process.env.PHONEPE_SALT_KEY;
  const checksum =
    sha256(toHash).toString() + "###" + process.env.PHONEPE_SALT_INDEX;

  console.log("checksum============", checksum);
  console.log("base64Payload============", base64Payload);
  try {
    const response = await axios.post(
      "https://api.phonepe.com/apis/hermes/pg/v1/pay",
      { request: base64Payload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          accept: "application/json",
        },
      }
    );

    return {
      redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
      transactionId,
    };
  } catch (error: any) {
    console.error("PhonePe Error:", error.response?.data || error.message);
    throw new Error("Failed to initiate PhonePe payment");
  }
}
