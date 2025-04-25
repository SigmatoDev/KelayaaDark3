import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";
import BanglesProductModel from "@/lib/models/BanglesProductSchema";
import BeadsProductModel from "@/lib/models/BeadsProductModel";
import ProductModel from "@/lib/models/ProductModel";
import SetsProductModel from "@/lib/models/SetsProductsModel";

export const GET = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json(
      { message: "unauthorized" },
      {
        status: 401,
      }
    );
  }

  const { user } = req.auth;
  await dbConnect();

  // Fetch orders for the authenticated user
  const orders = await OrderModel.aggregate([
    {
      $match: {
        "personalInfo.mobileNumber": user.mobileNumber,
      },
    },
    {
      $unwind: "$items", // Unwind items to process each item individually
    },
    {
      $lookup: {
        from: "setsproducts", // Join SetsProductModel
        localField: "items.product",
        foreignField: "_id",
        as: "itemProductSets",
      },
    },
    {
      $lookup: {
        from: "banglesproducts", // Join BanglesProductModel
        localField: "items.product",
        foreignField: "_id",
        as: "itemProductBangles",
      },
    },
    {
      $lookup: {
        from: "beadsproducts", // Join BeadsProductModel
        localField: "items.product",
        foreignField: "_id",
        as: "itemProductBeads",
      },
    },
    {
      $lookup: {
        from: "products", // Join default ProductModel
        localField: "items.product",
        foreignField: "_id",
        as: "itemProductDefault",
      },
    },
    {
      $addFields: {
        "items.product": {
          $cond: {
            if: { $gt: [{ $size: "$itemProductSets" }, 0] }, // If SetsProduct found
            then: { $arrayElemAt: ["$itemProductSets", 0] },
            else: {
              $cond: {
                if: { $gt: [{ $size: "$itemProductBangles" }, 0] }, // If BanglesProduct found
                then: { $arrayElemAt: ["$itemProductBangles", 0] },
                else: {
                  $cond: {
                    if: { $gt: [{ $size: "$itemProductBeads" }, 0] }, // If BeadsProduct found
                    then: { $arrayElemAt: ["$itemProductBeads", 0] },
                    else: {
                      $arrayElemAt: ["$itemProductDefault", 0], // Default to ProductModel
                    },
                  },
                },
              },
            },
          },
        },
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
      },
    },
  ]);

  return Response.json(orders);
});
