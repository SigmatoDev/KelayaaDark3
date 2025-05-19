import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { amount } = body;

    if (!amount || isNaN(amount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const merchantTransactionId = `TXN_${Date.now()}`;
    const amountInPaise = Math.round(amount * 100);

    // Read from env
    const merchantId = process.env.NEXT_PUBLIC_MERCHANT_ID!;
    const saltKey = process.env.NEXT_PUBLIC_SALT_KEY!;
    const saltIndex = process.env.NEXT_PUBLIC_SALT_INDEX!;
    const phonePeHost = process.env.NEXT_PUBLIC_PHONE_PAY_HOST_URL!;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

    const redirectUrl = `${baseUrl}/checkout/success`;
    const failureRedirectUrl = `${baseUrl}/checkout/failure`;

    // Build payload
    const payload = {
      merchantId,
      merchantTransactionId,
      merchantUserId: "USER123",
      amount: amountInPaise,
      redirectUrl,
      redirectMode: "POST",
      callbackUrl: redirectUrl,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    // Encode & sign payload
    const payloadString = JSON.stringify(payload);
    const base64Payload = Buffer.from(payloadString).toString("base64");
    const stringToSign = base64Payload + "/pg/v1/pay" + saltKey;
    const xVerify =
      crypto.createHash("sha256").update(stringToSign).digest("hex") +
      "###" +
      saltIndex;

    // Call PhonePe API
    const response = await fetch(`${phonePeHost}/pg/v1/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": xVerify,
        accept: "application/json",
      },
      body: JSON.stringify({ request: base64Payload }),
    });

    const data = await response.json();

    if (data.success && data.data?.instrumentResponse?.redirectInfo?.url) {
      return NextResponse.json({
        url: data.data.instrumentResponse.redirectInfo.url,
        transactionId: merchantTransactionId,
      });
    }

    return NextResponse.json(
      { error: "Failed to initiate transaction", details: data },
      { status: 400 }
    );
  } catch (err) {
    console.error("PhonePe Payment Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
