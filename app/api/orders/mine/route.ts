import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";
import mongoose from "mongoose";

export const GET = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json({ message: "unauthorized" }, { status: 401 });
  }

  const { user } = req.auth;
  await dbConnect();

  // Ensure user._id is a valid ObjectId
  const userId =
    typeof user._id === "string"
      ? new mongoose.Types.ObjectId(user._id)
      : user._id;

  // Fetch orders for the authenticated user using `user` field
  const orders = await OrderModel.aggregate([
    {
      $match: {
        user: userId,
      },
    },
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "setsproducts",
        localField: "items.product",
        foreignField: "_id",
        as: "itemProductSets",
      },
    },
    {
      $lookup: {
        from: "banglesproducts",
        localField: "items.product",
        foreignField: "_id",
        as: "itemProductBangles",
      },
    },
    {
      $lookup: {
        from: "beadsproducts",
        localField: "items.product",
        foreignField: "_id",
        as: "itemProductBeads",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "itemProductDefault",
      },
    },
    {
      $addFields: {
        "items.product": {
          $cond: {
            if: { $gt: [{ $size: "$itemProductSets" }, 0] },
            then: { $arrayElemAt: ["$itemProductSets", 0] },
            else: {
              $cond: {
                if: { $gt: [{ $size: "$itemProductBangles" }, 0] },
                then: { $arrayElemAt: ["$itemProductBangles", 0] },
                else: {
                  $cond: {
                    if: { $gt: [{ $size: "$itemProductBeads" }, 0] },
                    then: { $arrayElemAt: ["$itemProductBeads", 0] },
                    else: { $arrayElemAt: ["$itemProductDefault", 0] },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $group: {
        _id: "$_id",
        items: { $push: "$items" },
        personalInfo: { $first: "$personalInfo" },
        shippingAddress: { $first: "$shippingAddress" },
        gstDetails: { $first: "$gstDetails" },
        billingDetails: { $first: "$billingDetails" },
        paymentMethod: { $first: "$paymentMethod" },
        itemsPrice: { $first: "$itemsPrice" },
        shippingPrice: { $first: "$shippingPrice" },
        taxPrice: { $first: "$taxPrice" },
        totalPrice: { $first: "$totalPrice" },
        isPaid: { $first: "$isPaid" },
        isDelivered: { $first: "$isDelivered" },
        paidAt: { $first: "$paidAt" },
        paymentIntentId: { $first: "$paymentIntentId" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        orderNumber: { $first: "$orderNumber" },
        deliveredAt: { $first: "$deliveredAt" },
        paymentStatus: { $first: "$paymentStatus" },
      },
    },
  ]);

  return Response.json(orders);
});
