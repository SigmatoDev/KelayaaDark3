"use server";

import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import axios from "axios";

export async function initiatePayment(data: number) {
  const transactionId = "Tr-" + uuidv4().toString().slice(-6);

  const payload = {
    merchantId: process.env.PHONEPE_MERCHANT_ID!,
    merchantTransactionId: transactionId,
    merchantUserId: "MUID-" + uuidv4().toString().slice(-6),
    amount: data * 100,
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
  const saltKey = process.env.PHONEPE_SALT_KEY!;
  const saltIndex = process.env.PHONEPE_SALT_INDEX!;

  const toSign = base64Payload + path + saltKey;

  const checksum =
    crypto.createHash("sha256").update(toSign).digest("hex") +
    `###${saltIndex}`;

  const PAY_API_URL = `${process.env.PHONEPE_HOST_URL}${path}`;

  try {
    const response = await axios.post(
      PAY_API_URL,
      { request: base64Payload },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
        },
      }
    );

    return {
      redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
      transactionId,
    };
  } catch (error: any) {
    console.error("PhonePe Error:", error?.response?.data || error.message);
    throw new Error("Failed to initiate PhonePe payment");
  }
}
