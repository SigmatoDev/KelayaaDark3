"use server";

import { getPhonePeAccessToken } from "@/lib/getPhonePeAccesstoken";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export async function initiatePayment(amount: number) {
  try {
    const tokenResponse = await getPhonePeAccessToken();
    const accessToken = tokenResponse.access_token;
    const tokenType = tokenResponse.token_type || "O-Bearer";

    const transactionId = `Tr-${uuidv4().slice(-6)}`;

    const payload = {
      merchantOrderId: transactionId,
      amount: amount * 100, // in paise
      expireAfter: tokenResponse?.expires_in, // seconds (20 minutes)
      metaInfo: {
        udf1: "test1",
        udf2: "new param2",
        udf3: "test3",
        udf4: "dummy value 4",
        udf5: "additional info ref1",
      },
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: "Payment message used for collect requests",
        merchantUrls: {
          redirectUrl: `${process.env.PHONEPE_REDIRECT_URL}/${transactionId}`,
        },
      },
    };

    const res = await axios.post(
      `${process.env.PHONEPE_BASE_URL}/checkout/v2/pay`,
      payload,
      {
        headers: {
          Authorization: `${tokenType} ${accessToken}`, // O-Bearer <access_token>
          "Content-Type": "application/json",
        },
      }
    );

    const redirectUrl = res.data?.data?.redirectInfo?.url;

    if (!redirectUrl) {
      console.error("PhonePe Error:", res.data);
      throw new Error("Failed to initiate PhonePe payment");
    }

    return {
      redirectUrl,
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
