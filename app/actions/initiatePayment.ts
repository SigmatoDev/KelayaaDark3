"use server";

import { getPhonePeAccessToken } from "@/lib/getPhonePeAccesstoken";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export async function initiatePayment(amount: number) {
  try {
    const accessToken = await getPhonePeAccessToken();

    const transactionId = `Tr-${uuidv4().slice(-6)}`;
    const payload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: `MUID-${uuidv4().slice(-6)}`,
      amount: amount * 100,
      redirectUrl: `${process.env.PHONEPE_REDIRECT_URL}/${transactionId}`,
      redirectMode: "REDIRECT",
      callbackUrl: `${process.env.PHONEPE_REDIRECT_URL}/${transactionId}`,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const res = await axios.post(
      `${process.env.PHONEPE_BASE_URL}/checkout/v2/pay`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const redirectUrl = res.data?.data?.instrumentResponse?.redirectInfo?.url;

    if (!redirectUrl) {
      console.error("PhonePe Error:", res.data);
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
