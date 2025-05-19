// actions/initiatePayment.ts
import { v4 as uuidv4 } from "uuid";
import sha256 from "crypto-js/sha256";
import axios from "axios";

export async function initiatePayment(data: number) {
  const transactionId = "Tr-" + uuidv4().toString().slice(-6); // You can customize this to use product ID or order ID.

  const payload = {
    merchantId: "M22ZZ74QR572I",
    merchantTransactionId: transactionId,
    merchantUserId: "MUID-" + uuidv4().toString().slice(-6),
    amount: 100 * data, // Convert amount to paise
    redirectUrl: `https://kelayaa.com/status/${transactionId}`,
    redirectMode: "REDIRECT",
    callbackUrl: `https://kelayaa.com/status/${transactionId}`,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const dataPayload = JSON.stringify(payload);
  const dataBase64 = Buffer.from(dataPayload).toString("base64");

  const fullURL =
    dataBase64 + "/pg/v1/pay" + "d264e78c-7592-4bcf-b30f-428794189af";
  const dataSha256 = sha256(fullURL).toString();

  const checksum = dataSha256 + "###" + "1";

  const PAY_API_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";

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

    return {
      redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
      transactionId: transactionId,
    };
  } catch (error) {
    console.error(
      "Error in initiatePayment:",
      error.response?.data || error.message
    );
    throw error;
  }
}
