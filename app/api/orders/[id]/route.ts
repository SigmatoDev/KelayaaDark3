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
      user: req.auth.user._id,
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
    return Response.json(
      { message: err.message || "Failed to create order" },
      { status: 500 }
    );
  }
});

// The handler for GET requests
export const GET = auth(async (req, { params }: { params: { id: string } }) => {
  if (!req.auth) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const { id } = params; // Access `id` from the dynamic URL parameter

  if (!id) {
    return new Response(JSON.stringify({ message: "Order ID is required" }), {
      status: 400,
    });
  }

  try {
    await dbConnect();

    const order = await OrderModel.findById(id).populate("items.product");

    if (!order) {
      return new Response(JSON.stringify({ message: "Order not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(order), { status: 200 });
  } catch (err: any) {
    console.error("Error fetching order:", err);
    return new Response(
      JSON.stringify({ message: err.message || "Failed to fetch order" }),
      { status: 500 }
    );
  }
});
