// actions/initiatePayment.ts
import { v4 as uuidv4 } from "uuid";
import sha256 from "crypto-js/sha256";
import axios from "axios";

export async function initiatePayment(amount: number) {
  const transactionId = "Tr-" + uuidv4().toString().slice(-6);

  const payload = {
    merchantId: process.env.MERCHANT_ID!,
    merchantTransactionId: transactionId,
    merchantUserId: "MUID-" + uuidv4().toString().slice(-6),
    amount: amount * 100, // in paise
    redirectUrl: `${process.env.BASE_URL}/status/${transactionId}`,
    redirectMode: "REDIRECT",
    callbackUrl: `${process.env.BASE_URL}/status/${transactionId}`,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const dataPayload = JSON.stringify(payload);
  const dataBase64 = Buffer.from(dataPayload).toString("base64");

  const fullURL = dataBase64 + "/pg/v1/pay" + process.env.SALT_KEY;
  const checksum = sha256(fullURL).toString() + "###" + process.env.SALT_INDEX;

  const PAY_API_URL = `${process.env.PHONEPE_HOST_URL}/pg/v1/pay`;

  const response = await axios.post(
    PAY_API_URL,
    { request: dataBase64 },
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
}
