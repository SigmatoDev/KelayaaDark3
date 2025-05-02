// /app/api/razorpay/payment-details/route.ts
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Handle GET request for fetching payment details
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get("paymentId");

  if (!paymentId) {
    return new Response(JSON.stringify({ error: "Payment ID is required" }), {
      status: 400,
    });
  }

  try {
    const payment = await razorpay.payments.fetch(paymentId);
    console.log("payment", payment);

    return new Response(JSON.stringify(payment), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch payment details" }),
      { status: 500 }
    );
  }
}
