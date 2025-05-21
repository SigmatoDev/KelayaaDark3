import { NextRequest, NextResponse } from "next/server";
import gateway from "@/utility/phonepe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // ✅ Parse the JSON body

    const transactionId = `TXN-${Date.now()}`;
    const userId = `TXN-${Date.now()}`;

    const origin = req.headers.get("origin") || ""; // ✅ Safer fallback for origin

    const resp = await gateway.initPayment({
      amount: body.amount,
      transactionId,
      userId,
      redirectUrl: `${origin}/payment-redirect`,
      callbackUrl: `${origin}/api/phonepe/callback`,
    });

    return NextResponse.json(resp); // ✅ Return response with 200 by default
  } catch (error) {
    console.error("[Payment Initiation Error]", error);
    return NextResponse.json(
      { error: "Payment initiation failed" },
      { status: 500 }
    );
  }
}
