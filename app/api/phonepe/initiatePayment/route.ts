import PhonepeGateway from "@/utility/phonepe";
import { NextRequest, NextResponse } from "next/server";

const gateway = new PhonepeGateway({
  merchantId: process.env.PHONEPE_MERCHANT_ID!,
  saltKey: process.env.PHONEPE_SALT_KEY!,
  saltIndex: process.env.PHONEPE_SALT_INDEX!, // Add to your .env
  isDev: process.env.NODE_ENV !== "production",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const origin = req.headers.get("origin") || "";
    const transactionId = `TXN-${Date.now()}`;

    const resp = await gateway.initPayment({
      amount: body.amount,
      transactionId,
      userId: body.userId,
      redirectUrl: `${origin}/payment-redirect`,
      callbackUrl: `${origin}/api/phonepe/callback`,
    });

    return NextResponse.json(resp);
  } catch (error) {
    console.error("Payment Error:", error);
    return NextResponse.json({ success: false, error: "Payment initiation failed" }, { status: 500 });
  }
}
