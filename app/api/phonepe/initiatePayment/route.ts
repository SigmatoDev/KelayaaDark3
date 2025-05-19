import { initiatePayment } from "@/app/actions/initiatePayment";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const amount = Number(body.amount);
    console.log("amount", amount, typeof amount);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const result = await initiatePayment(amount);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/phonepe/initiatePayment:", error);
    return NextResponse.json(
      { error: "Payment initiation failed" },
      { status: 500 }
    );
  }
};
