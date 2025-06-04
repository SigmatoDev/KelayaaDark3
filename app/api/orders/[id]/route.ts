import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";
import ProductModel from "@/lib/models/ProductModel";
import BeadsProductModel from "@/lib/models/BeadsProductModel";
import SetsProductModel from "@/lib/models/SetsProductsModel";
import BanglesProductModel from "@/lib/models/BanglesProductSchema";
import { Types } from "mongoose";

export const GET = auth(
  async (req: any, { params }: { params: { id: string } }) => {
    if (!req.auth) {
      console.log("Unauthorized access attempt");
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { user } = req.auth;
    const orderId = params.id;

    await dbConnect();

    try {
      console.log("Fetching order with id:", orderId);
      const order = await OrderModel.findById(orderId)
        .populate("user", "-password -__v") // Populate user & exclude sensitive fields
        .lean();

      if (!order) {
        console.log("Order not found for id:", orderId);
        return Response.json({ message: "Order not found" }, { status: 404 });
      }

      console.log("Order found:", order);

      // Check if user field exists on order before accessing _id
      if (!user.isAdmin) {
        if (!order.user) {
          console.log(
            "Order user is missing, access denied. Order id:",
            orderId
          );
          return Response.json({ message: "Access denied" }, { status: 403 });
        }
        if (order.user._id.toString() !== user._id.toString()) {
          console.log(
            "Access denied - user id mismatch",
            "Order user:",
            order.user._id.toString(),
            "Requesting user:",
            user._id.toString()
          );
          return Response.json({ message: "Access denied" }, { status: 403 });
        }
      }

      console.log("Populating products for order items...");
      // Manually populate each product based on productId
      const populatedItems = await Promise.all(
        order.items.map(async (item: any, index: number) => {
          try {
            const id = new Types.ObjectId(item.productId);
            let product =
              (await SetsProductModel.findById(id).lean()) ||
              (await BanglesProductModel.findById(id).lean()) ||
              (await BeadsProductModel.findById(id).lean()) ||
              (await ProductModel.findById(id).lean());

            if (!product) {
              console.log(
                `Product not found for item index ${index}, productId: ${item.productId}`
              );
            }

            return {
              ...item,
              product, // Add full product info
            };
          } catch (err) {
            console.error(
              `Error populating product for item index ${index}`,
              err
            );
            return item; // Return item without product if error occurs
          }
        })
      );

      console.log("Successfully populated products for all items.");
      return Response.json({ ...order, items: populatedItems });
    } catch (error: any) {
      console.error("❌ Error caught in GET /api/orders/[id]:", error);
      return Response.json({ message: error.message }, { status: 500 });
    }
  }
);
