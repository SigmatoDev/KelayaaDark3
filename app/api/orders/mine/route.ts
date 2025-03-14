import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";
import { serialize } from "@/lib/utils";

export const GET = auth(async (req: any) => {
  try {
    if (!req.auth) {
      return Response.json(
        { message: "Please sign in to view your orders" },
        { status: 401 }
      );
    }

    await dbConnect();

    const orders = await OrderModel.find({
      user: req.auth.user.id
    })
    .sort({ createdAt: -1 })
    .populate('items.product', 'name image price')
    .lean();

    console.log(`API: Found ${orders.length} orders`);

    // Transform the orders to include all necessary information
    const transformedOrders = orders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,
      items: order.items.map((item: any) => ({
        name: item.product?.name || 'Product Not Found',
        image: item.product?.image || '/placeholder.png',
        price: item.price,
        qty: item.qty
      })),
      totalPrice: order.totalPrice,
      isPaid: order.isPaid,
      isDelivered: order.isDelivered,
      paidAt: order.paidAt,
      deliveredAt: order.deliveredAt,
      status: order.status
    }));

    console.log("API: Sending response with transformed orders");
    return Response.json(serialize(transformedOrders));
  } catch (error: any) {
    console.error('Server error:', error);
    return Response.json(
      { message: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}) as any;
