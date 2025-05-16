// actions/initiatePayment.ts

"use server";
import { v4 as uuidv4 } from "uuid";
import sha256 from "crypto-js/sha256";
import axios from "axios";

export async function initiatePayment(data: number) {
  const transactionId = "Tr-" + uuidv4().toString().slice(-6); // Here I am generating random id you can send the id of the product you are selling or anything else.

  const payload = {
    merchantId: process.env.NEXT_PUBLIC_MERCHANT_ID,
    merchantTransactionId: transactionId,
    merchantUserId: "MUID-" + uuidv4().toString().slice(-6),
    amount: 100 * data, // Amount is converted to the smallest currency unit (e.g., cents/paise) by multiplying by 100. For example, $1 = 100 cents or ₹1 = 100 paise.
    redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/status/${transactionId}`,
    redirectMode: "REDIRECT",
    callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/status/${transactionId}`,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const dataPayload = JSON.stringify(payload);
  const dataBase64 = Buffer.from(dataPayload).toString("base64");

  const fullURL = dataBase64 + "/pg/v1/pay" + process.env.NEXT_PUBLIC_SALT_KEY;
  const dataSha256 = sha256(fullURL).toString();

  const checksum = dataSha256 + "###" + process.env.NEXT_PUBLIC_SALT_INDEX;

  const UAT_PAY_API_URL = `${process.env.NEXT_PUBLIC_PHONE_PAY_HOST_URL}/pg/v1/pay`;

  try {
    const response = await axios.post(
      UAT_PAY_API_URL,
      { request: dataBase64 },
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
      transactionId: transactionId,
    };
  } catch (error) {
    console.error("Error in server action:", error);
    throw error;
  }
}
