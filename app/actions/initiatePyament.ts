import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      amount,
      merchantTransactionId,
      merchantUserId,
      redirectUrl,
      mobileNumber,
    } = body;

    // PhonePe required data
    const payload = {
      merchantId: process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID!,
      merchantTransactionId,
      merchantUserId,
      amount, // Amount in paise (e.g., 100 = ₹1.00)
      redirectUrl,
      redirectMode: "REDIRECT",
      callbackUrl: redirectUrl,
      mobileNumber,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    // Convert payload to base64
    const jsonPayload = JSON.stringify(payload);
    const base64Payload = Buffer.from(jsonPayload).toString("base64");

    // Live environment: HMAC-SHA256
    const fullPath = "/pg/v1/pay";
    const hmac = crypto.createHmac(
      "sha256",
      process.env.NEXT_PUBLIC_PHONEPE_SALT_KEY!
    );
    hmac.update(base64Payload + fullPath);
    const hash = hmac.digest("hex");

    // Final checksum format
    const checksum = `${hash}###${process.env.NEXT_PUBLIC_PHONEPE_SALT_INDEX!}`;

    // Send payment initiation request to PhonePe
    const response = await axios.post(
      `https://api.phonepe.com/apis/hermes${fullPath}`,
      { request: base64Payload },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
        },
      }
    );

    // Return PhonePe response
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(
      "Payment Initiation Error:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { success: false, error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
