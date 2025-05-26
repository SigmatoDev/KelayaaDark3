"use server";

import { getPhonePeAccessToken } from "@/lib/getPhonePeAccesstoken";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export async function initiatePayment(amount: number) {
  try {
    const tokenResponse = await getPhonePeAccessToken();
    const accessToken = tokenResponse.access_token;
    const tokenType = tokenResponse.token_type || "O-Bearer";

    const rawId = uuidv4().replace(/[^a-zA-Z0-9_-]/g, ""); // keep only allowed characters
    const transactionId = `TX${rawId.slice(0, 21)}`;
    const payload = {
      merchantOrderId: transactionId,
      amount: amount * 100, // in paise
      expireAfter: tokenResponse?.expires_in, // seconds (20 minutes)
      metaInfo: {
        udf1: "",
        udf2: "",
        udf3: "",
        udf4: "",
        udf5: "",
      },
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: "Payment message used for collect requests",
        merchantUrls: {
          redirectUrl: `${process.env.PHONEPE_REDIRECT_URL}/status/${transactionId}`,
        },
      },
    };

    const res = await axios.post(
      `${process.env.PHONEPE_BASE_URL}/checkout/v2/pay`,
      payload,
      {
        headers: {
          Authorization: `${tokenType} ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      fullResponse: res.data,
      transactionId,
    };
  } catch (error: any) {
    console.error(
      "Error in PhonePe Payment:",
      error.response?.data || error.message
    );
    throw error;
  }
}
