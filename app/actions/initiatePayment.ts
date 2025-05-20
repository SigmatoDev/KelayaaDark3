"use server";

import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export async function initiatePayment(amount: number) {
  try {
    // Step 1: Get Access Token (OAuth2)
    const tokenRes = await axios.post(
      `${process.env.PHONEPE_BASE_URL}/v3/authorize/token`,
      {
        client_id: process.env.PHONEPE_CLIENT_ID,
        client_secret: process.env.PHONEPE_CLIENT_SECRET,
        grant_type: "client_credentials",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) throw new Error("Failed to get access token");

    // Step 2: Generate transaction details
    const transactionId = `Tr-${uuidv4().slice(-6)}`;
    const payload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: `MUID-${uuidv4().slice(-6)}`,
      amount: amount * 100, // amount in paise
      redirectUrl: `${process.env.PHONEPE_REDIRECT_URL}/${transactionId}`,
      redirectMode: "REDIRECT",
      callbackUrl: `${process.env.PHONEPE_REDIRECT_URL}/${transactionId}`,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    // Step 3: Initiate Payment
    const paymentRes = await axios.post(
      `${process.env.PHONEPE_BASE_URL}/v3/initiatePayment`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const redirectUrl =
      paymentRes.data?.data?.instrumentResponse?.redirectInfo?.url;

    if (!redirectUrl) {
      console.error("PhonePe Error:", paymentRes.data);
      throw new Error("Failed to initiate PhonePe payment");
    }

    return {
      redirectUrl,
      transactionId,
    };
  } catch (error) {
    console.error("Error in PhonePe Payment:", error);
    throw error;
  }
}
