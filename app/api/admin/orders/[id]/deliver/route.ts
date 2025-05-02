import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";

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

    const { status } = await req.json();

    const validStatuses = ["processing", "completed", "cancelled"];
    if (status && !validStatuses.includes(status)) {
      return Response.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    if (status) {
      order.status = status;

      // If marking as completed, ensure the order is paid
      if (status === "completed") {
        if (!order.isPaid) {
          return Response.json(
            { message: "Order is not paid" },
            { status: 400 }
          );
        }
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }

      // If cancelled, unset delivery fields
      if (status === "cancelled") {
        order.isDelivered = false;
        order.deliveredAt = null;
      }
    }

    const updatedOrder = await order.save();
    return Response.json(updatedOrder);
  } catch (err: any) {
    return Response.json({ message: err.message }, { status: 500 });
  }
}) as any;
