import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

const MERCHANT_ID = process.env.MERCHANT_ID!;
const SALT_KEY = process.env.SALT_KEY!;
const SALT_INDEX = process.env.SALT_INDEX!;
const PHONEPE_PROD_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";

export async function POST(req: NextRequest) {
  try {
    console.log("Step 1: Received request");
    const { amount } = await req.json();
    console.log("Step 2: Parsed amount from body:", amount);

    if (!amount || typeof amount !== "number") {
      console.error("Step 3: Invalid amount:", amount);
      return NextResponse.json(
        { error: "Amount is required and must be a number" },
        { status: 400 }
      );
    }

    const transactionId = `Tr-${Date.now()}`;
    const userId = uuidv4();
    console.log(
      "Step 4: Generated transactionId and userId:",
      transactionId,
      userId
    );

    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: `MUID-${userId}`,
      amount: amount * 100, // Convert to paisa
      redirectUrl: `https://kelayaa.com/status/${transactionId}`,
      redirectMode: "REDIRECT",
      callbackUrl: `https://kelayaa.com/status/${transactionId}`,
      paymentInstrument: { type: "PAY_PAGE" },
    };

    console.log("Step 5: Payload to send:", payload);

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
      "base64"
    );
    const stringToHash = `${base64Payload}/pg/v1/pay${SALT_KEY}`;
    const sha256Hash = crypto
      .createHash("sha256")
      .update(stringToHash)
      .digest("hex");
    const checksum = `${sha256Hash}###${SALT_INDEX}`;
    console.log("Step 6: Generated checksum:", checksum);

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

    console.log("Step 7: Received response status:", response.status);

    const data = await response.json();
    console.log("Step 8: Response data:", data);

    if (response.status !== 200 || data.success === false) {
      console.error("Step 9: PhonePe API returned error:", data);
      return NextResponse.json(
        { error: "Payment initiation failed", detail: data },
        { status: 500 }
      );
    }

    console.log("Step 10: Payment initiation successful");
    return NextResponse.json({
      success: true,
      transactionId,
      redirectUrl: data.data.instrumentResponse.redirectInfo.url,
    });
  } catch (error) {
    console.error("Step 11: Unexpected error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
