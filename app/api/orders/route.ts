import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose"; // ✅ IMPORTANT
import OrderModel from "@/lib/models/OrderModel";

export const POST = auth(async (...request: any) => {
  const [req] = request;

  if (!req.auth) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const {
      orderNumber,
      status,
      items,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalAmount,
      shippingAddress,
      billingDetails,
      gstDetails,
      paymentStatus,
      paymentMethod,
      paymentIntentId,
      personalInfo,
    } = await req.json();

    if (!items || !totalAmount || !shippingAddress || !personalInfo || !gstDetails) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newOrder = await OrderModel.create({
      user: new mongoose.Types.ObjectId(req.auth.userId), // ✅ converted
      orderNumber,
      status,
      items,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice: totalAmount,
      shippingAddress,
      billingDetails,
      gstDetails,
      paymentStatus,
      paymentMethod,
      paymentIntentId,
      personalInfo,
      isPaid: paymentStatus === "completed",
      paidAt: paymentStatus === "completed" ? new Date() : undefined,
    });

    return Response.json({ success: true, order: newOrder }, { status: 201 });

  } catch (error: any) {
    console.error("Order Creation Error:", error.message);
    return Response.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
});
