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
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { user } = req.auth;
    const orderId = params.id;

    await dbConnect();

    try {
      const order = await OrderModel.findById(orderId)
        .populate("user", "-password -__v") // ✅ Populate user & exclude sensitive fields
        .lean();

      if (!order) {
        return Response.json({ message: "Order not found" }, { status: 404 });
      }

      if (!user.isAdmin && order.user._id.toString() !== user._id.toString()) {
        return Response.json({ message: "Access denied" }, { status: 403 });
      }

      // Manually populate each product based on productId
      const populatedItems = await Promise.all(
        order.items.map(async (item: any) => {
          const id = new Types.ObjectId(item.productId);
          let product =
            (await SetsProductModel.findById(id).lean()) ||
            (await BanglesProductModel.findById(id).lean()) ||
            (await BeadsProductModel.findById(id).lean()) ||
            (await ProductModel.findById(id).lean());

          return {
            ...item,
            product, // Add full product info
          };
        })
      );

      return Response.json({ ...order, items: populatedItems });
    } catch (error: any) {
      console.error("❌ Error:", error);
      return Response.json({ message: error.message }, { status: 500 });
    }
  }
);
