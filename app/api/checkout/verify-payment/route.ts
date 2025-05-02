import { auth } from "@/lib/auth";
import crypto from "crypto";

export const POST = auth(async (request: Request) => {
  const req = request;

  // Ensure the user is authenticated
  if (!req.auth) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Get necessary data from the request body
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    await req.json();

  // Validate required fields
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return Response.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  // Ensure the Razorpay secret key is securely stored in environment variables
  const razorpaySecretKey = process.env.RAZORPAY_KEY_SECRET; // Store in environment variable for security

  if (!razorpaySecretKey) {
    return Response.json(
      { message: "Razorpay secret key is missing" },
      { status: 500 }
    );
  }

  // Generate the expected signature using the Razorpay secret key
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", razorpaySecretKey)
    .update(body)
    .digest("hex");

  // Verify the payment signature
  if (expectedSignature === razorpay_signature) {
    return Response.json({
      success: true,
      paymentIntentId: razorpay_payment_id, // Return the payment intent ID
    });
  } else {
    return Response.json(
      {
        success: false,
        message: "Payment verification failed. Invalid signature.",
      },
      { status: 400 }
    );
  }
});
