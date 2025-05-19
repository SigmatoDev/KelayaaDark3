// actions/initiatePayment.ts
import { v4 as uuidv4 } from "uuid";
import sha256 from "crypto-js/sha256";
import axios from "axios";

export async function initiatePayment(amount: number) {
  const transactionId = "Tr-" + uuidv4().toString().slice(-6);
  const merchantUserId = "MUID-" + uuidv4().toString().slice(-6);

  const payload = {
    merchantId: process.env.MERCHANT_ID!,
    merchantTransactionId: transactionId,
    merchantUserId: merchantUserId,
    amount: amount * 100, // amount in paise
    redirectUrl: `${process.env.BASE_URL}/status/${transactionId}`,
    redirectMode: "REDIRECT",
    callbackUrl: `${process.env.BASE_URL}/status/${transactionId}`,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const dataPayload = JSON.stringify(payload);
  const dataBase64 = Buffer.from(dataPayload).toString("base64");

  // ✅ Form checksum correctly per PhonePe docs
  const endpoint = "/pg/v1/pay";
  const saltKey = process.env.SALT_KEY!;
  const saltIndex = process.env.SALT_INDEX!;

  const toHash = dataBase64 + endpoint + saltKey;
  const checksum = sha256(toHash).toString() + "###" + saltIndex;

  const PAY_API_URL = `${process.env.PHONEPE_HOST_URL}${endpoint}`;

  try {
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

    const redirectUrl =
      response.data?.data?.instrumentResponse?.redirectInfo?.url;

    if (!redirectUrl) {
      throw new Error("Redirect URL missing in PhonePe response.");
    }

    return {
      redirectUrl,
      transactionId,
    };
  } catch (error: any) {
    console.error(
      "PhonePe Payment Init Error:",
      error?.response?.data || error
    );
    throw new Error("Failed to initiate PhonePe payment.");
  }
}
