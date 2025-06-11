import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";
import mongoose from "mongoose";
import { auth } from "@/lib/auth"; // 🔐 Your session util

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await dbConnect();

  const session = await auth(); // ✅ Get logged-in user session
  const loggedInUserId = session?.user?._id;

  const { id } = context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid order ID" }, { status: 400 });
  }

  try {
    const order = await OrderModel.findById(id);

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus !== "FAILED") {
      return NextResponse.json(
        { message: "This order is already paid or not eligible for retry." },
        { status: 400 }
      );
    }

    // 🔒 Restrict access based on user
    if (order.user) {
      const orderUserId = order.user.toString();
      if (!loggedInUserId || loggedInUserId !== orderUserId) {
        return NextResponse.json(
          { message: "You are not authorized to retry this order." },
          { status: 403 }
        );
      }
    } else {
      // Guest user must not be logged in
      if (loggedInUserId) {
        return NextResponse.json(
          { message: "This is a guest order. Log out to retry." },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          items: order.items,
          totalAmount: order.totalPrice,
          personalInfo: order.personalInfo,
          shippingAddress: order.shippingAddress,
          paymentStatus: order.paymentStatus,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Retry fetch error:", err.message);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
