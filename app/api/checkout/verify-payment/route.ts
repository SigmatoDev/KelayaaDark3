
// /api/checkout/verify-payment/route.ts
import { auth } from '@/lib/auth';
import crypto from 'crypto';

export const POST = auth(async (...request: any) => {
  const [req] = request;

  if (!req.auth) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return Response.json({ message: 'Missing required fields' }, { status: 400 });
  }

//   key_id: "rzp_test_tvPxFRf40bmLkn",
//   key_secret: "UPG168c147tfM7rVEJFEJGHk",

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', "UPG168c147tfM7rVEJFEJGHk")
    .update(body.toString())
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    return Response.json({ success: true, paymentIntentId: razorpay_payment_id });
  } else {
    return Response.json({ success: false, message: 'Payment verification failed' }, { status: 400 });
  }
});
