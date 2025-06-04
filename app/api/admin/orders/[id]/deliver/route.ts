import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";
import { sendOrderStatusUpdateEmail } from "@/utility/sendOrderStatusUpdateEmail";

export const PUT = auth(async (...args: any) => {
  const [req, { params }] = args;

  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: "unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const order = await OrderModel.findById(params.id);
    if (!order) {
      return Response.json({ message: "Order not found" }, { status: 404 });
    }

    const { status, note } = await req.json();
    const validStatuses = [
      "processing",
      "shipped",
      "out-for-delivery",
      "completed",
      "cancelled",
    ];

    if (!status || !validStatuses.includes(status)) {
      return Response.json(
        { message: "Invalid or missing status" },
        { status: 400 }
      );
    }

    // Initialize statusHistory if it doesn't exist
    if (!Array.isArray(order.statusHistory)) {
      order.statusHistory = [];
    }

    // Update main status field
    order.status = status;

    // Push new entry to statusHistory
    order.statusHistory.push({
      status,
      note: typeof note === "string" ? note : undefined,
      changedAt: new Date(),
      changedBy: {
        _id: req.auth.user._id,
        name: req.auth.user.name,
        email: req.auth.user.email,
      },
    });

    // Special logic for completed orders
    if (status === "completed") {
      if (!order.isPaid) {
        return Response.json({ message: "Order is not paid" }, { status: 400 });
      }
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    // Reset delivery info for cancelled/failed
    if (status === "cancelled" || status === "failed") {
      order.isDelivered = false;
      order.deliveredAt = null;
    }

    const updatedOrder = await order.save();

    await sendOrderStatusUpdateEmail({
      order: updatedOrder,
      status,
      note,
      changedAt: new Date(),
    });
    return Response.json(updatedOrder);
  } catch (err: any) {
    return Response.json({ message: err.message }, { status: 500 });
  }
}) as any;
