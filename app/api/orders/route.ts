import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose"; // ✅ IMPORTANT
import OrderModel from "@/lib/models/OrderModel";
import { sendOrderEmails } from "@/utility/sendOrderEmail";
import AbandonedCart from "@/lib/models/AbondenCart";
import ProductModel from "@/lib/models/ProductModel";
import SetsProductModel from "@/lib/models/SetsProductsModel";
import BanglesProductModel from "@/lib/models/BanglesProductSchema";
import BeadsProductModel from "@/lib/models/BeadsProductModel";

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

    // Create a new order in the database
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

    // Loop through the ordered items and update stock for each product
    for (const item of items) {
      // Get the productId from the order item and the ordered quantity (qty)
      const { productId, qty } = item;

      // Determine which model to use based on its productId
      let productModel;
      let product;

      // Try to find the product in ProductModel, SetsProductModel, BanglesProductModel, or BeadsProductModel
      product = await ProductModel.findById(productId);
      if (!product) {
        product = await SetsProductModel.findById(productId);
      }
      if (!product) {
        product = await BanglesProductModel.findById(productId);
      }
      if (!product) {
        product = await BeadsProductModel.findById(productId); // Added BeadsProductModel
      }

      if (product) {
        if (product.materialType === "Beads") {
          // For beads, we need to update both countInStock and inventory_no_of_line
          const newStock = product.countInStock - qty;
          const newLines = product.inventory_no_of_line - qty;

          // Check if stock and lines are sufficient
          if (newStock < 0 || newLines < 0) {
            throw new Error(`Insufficient stock or lines for ${product.name}`);
          }

          // Update the product's stock and lines
          product.countInStock = newStock;
          product.inventory_no_of_line = newLines;
          await product.save();
        } else {
          // For other products, we just update countInStock
          const newStock = product.countInStock - qty;

          // Check if stock is sufficient
          if (newStock < 0) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }

          // Update the product's stock
          product.countInStock = newStock;
          await product.save();
        }
      } else {
        console.error(`Product with ID ${productId} not found.`);
      }
    }

    // Send order confirmation emails
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
