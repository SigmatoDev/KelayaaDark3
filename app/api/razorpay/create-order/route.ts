import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json(); // amount in rupees

    if (!amount) {
      return NextResponse.json({ success: false, message: "Amount is required" }, { status: 400 });
    }

    // Razorpay instance
    const razorpay = new Razorpay({
      key_id: "rzp_test_tvPxFRf40bmLkn",
      key_secret: "UPG168c147tfM7rVEJFEJGHk",
    });

    const payment_capture = 1;
    const currency = "INR";

    const options = {
      amount: amount * 100, // Razorpay needs amount in paise
      currency,
      payment_capture,
      notes: {
        platform: "Kelayaa", // optional, your branding
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error("Razorpay Create Order Error:", error);
    return NextResponse.json({ success: false, message: "Razorpay order creation failed" }, { status: 500 });
  }
}
