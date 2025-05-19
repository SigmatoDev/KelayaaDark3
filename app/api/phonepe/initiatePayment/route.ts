// app/api/payment/initiate/route.ts
import { initiatePayment } from "@/app/actions/initiatePayment";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();
    const result = await initiatePayment(amount);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in API route:", error.response?.data || error.message);
    return new NextResponse("Failed to initiate payment", { status: 500 });
  }
}
