import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID!;
const SALT_KEY = process.env.PHONEPE_SALT_KEY!;
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX!;
const PHONEPE_PROD_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";

export async function POST(req: NextRequest) {
  try {
    const { amount, transactionId, userId } = await req.json();

    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: `MUID-${userId}`,
      amount: amount * 100, // amount in paisa
      redirectUrl: `https://kelayaa.com/status/${transactionId}`,
      redirectMode: "REDIRECT",
      callbackUrl: `https://kelayaa.com/status/${transactionId}`,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
      "base64"
    );
    const stringToHash = `${base64Payload}/pg/v1/pay${SALT_KEY}`;
    const checksum =
      crypto.createHash("sha256").update(stringToHash).digest("hex") +
      `###${SALT_INDEX}`;

    const response = await fetch(PHONEPE_PROD_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "X-VERIFY": checksum,
        "X-CALLBACK-URL": `https://kelayaa.com/status/${transactionId}`,
      },
      body: JSON.stringify({ request: base64Payload }),
    });

    const data = await response.json();

    if (response.status !== 200 || data.success === false) {
      console.error("PhonePe Error:", data);
      return NextResponse.json(
        { error: "Payment initiation failed", detail: data },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      redirectUrl: data.data.instrumentResponse.redirectInfo.url,
    });
  } catch (error) {
    console.error("Error in initiatePayment:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
