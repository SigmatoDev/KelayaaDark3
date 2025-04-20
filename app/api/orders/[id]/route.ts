import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";

export const POST = auth(async (...request: any) => {
  const [req] = request;

  if (!req.auth) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const body = await req.json();
    console.log("🔥 Incoming order payload:", body);

    const {
      paymentMethod,
      shippingAddress,
      items,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentIntentId,
    } = body;

    if (!items || items.length === 0) {
      return Response.json({ message: "No items to order" }, { status: 400 });
    }

    const order = await OrderModel.create({
      user: req.auth.user.id,
      items,
      shippingAddress,
      paymentMethod,
      paymentIntentId,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: true,
      paidAt: new Date(),
    });

    console.log("✅ Order Created:", order);

    return Response.json({ order });
  } catch (err: any) {
    console.error("❌ Order creation error:", err);
    return Response.json({ message: err.message || "Failed to create order" }, { status: 500 });
  }
});
