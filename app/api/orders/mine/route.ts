import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import BanglesProductModel from "@/lib/models/BanglesProductSchema";
import BeadsProductModel from "@/lib/models/BeadsProductModel";
import OrderModel from "@/lib/models/OrderModel";
import ProductModel from "@/lib/models/ProductModel";
import SetsProductModel from "@/lib/models/SetsProductsModel";
import mongoose from "mongoose";

export const GET = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json({ message: "unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const userId =
    typeof req.auth.user._id === "string"
      ? new mongoose.Types.ObjectId(req.auth.user._id)
      : req.auth.user._id;

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const skip = (page - 1) * limit;

  // Step 1: Total count
  const totalOrders = await OrderModel.countDocuments({ user: userId });

  // Step 2: Fetch paginated orders
  let orders = await OrderModel.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  console.log("📦 Paginated Orders found:", orders.length);

  // Step 3: Populate product for each item
  for (const order of orders) {
    for (const item of order.items) {
      const productId = item.productId;

      let product =
        (await SetsProductModel.findOne({ _id: productId }).lean()) ||
        (await BanglesProductModel.findOne({ _id: productId }).lean()) ||
        (await BeadsProductModel.findOne({ _id: productId }).lean()) ||
        (await ProductModel.findOne({ _id: productId }).lean());

      item.product = product || null;
    }
  }

  const totalPages = Math.ceil(totalOrders / limit);

  return Response.json({
    orders,
    totalOrders,
    totalPages,
    currentPage: page,
  });
});
