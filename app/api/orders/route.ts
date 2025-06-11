import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose"; // ✅ IMPORTANT
import OrderModel from "@/lib/models/OrderModel";
import { sendOrderEmails } from "@/utility/sendOrderEmail";
import AbandonedCart from "@/lib/models/AbondenCart";

export const POST = auth(async (...request: any) => {
  const [req] = request;

  const isGuest = !req.auth?.user?._id;
  const userId = isGuest
    ? null
    : new mongoose.Types.ObjectId(req.auth.user._id);

  try {
    await dbConnect();

    const {
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
      paymentResult,
      unique_txn_id,
    } = await req.json();

    if (
      !items ||
      !totalAmount ||
      !shippingAddress ||
      !personalInfo ||
      !gstDetails
    ) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newOrder = await OrderModel.create({
      user: userId,
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
      isPaid: paymentStatus === "COMPLETED",
      paidAt: paymentStatus === "COMPLETED" ? new Date() : undefined,
      paymentResult,
      unique_txn_id,
    });

    const populatedOrder = userId
      ? await OrderModel.findById(newOrder._id).populate("user")
      : newOrder;

    // Recover Abandoned Cart entries if the user had any
    if (userId) {
      await AbandonedCart.updateMany(
        { userId, isRecovered: false },
        { $set: { isRecovered: true, updatedAt: new Date() } }
      );
    }

    await sendOrderEmails(populatedOrder);

    return Response.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error("Order Creation Error:", error.message);
    return Response.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
});
