import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModel, { OrderItem } from "@/lib/models/OrderModel";
import ProductModel from "@/lib/models/ProductModel";
import { round2 } from "@/lib/utils";

const calcPrices = (orderItems: OrderItem[]) => {
  const itemsPrice = round2(
    orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(Number(0.15 * itemsPrice));
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

export const POST = auth(async (req: any) => {
  console.log("🔍 [Order API] Received request...");

  if (!req.auth) {
    console.log("⛔ Unauthorized request");
    return Response.json({ message: "unauthorized" }, { status: 401 });
  }

  const { user } = req.auth;
  console.log("👤 Authenticated user:", user.id);

  try {
    const payload = await req.json();
    console.log("📦 Received payload:", payload);

    await dbConnect();
    console.log("✅ Connected to database");

    // ✅ Validate required fields
    if (!payload.items || payload.items.length === 0) {
      throw new Error("No items in the order.");
    }
    if (!payload.shippingAddress) {
      throw new Error("Shipping address is missing.");
    }
    if (!payload.paymentMethod) {
      throw new Error("Payment method is required.");
    }
    if (!payload.gstDetails) {
      throw new Error("GST details are required.");
    }
    if (payload.gstDetails.hasGST && !payload.gstDetails.gstNumber) {
      throw new Error("GST number is required when GST is enabled.");
    }
    if (!payload.personalInfo || !payload.personalInfo.email) {
      throw new Error("Personal email is required.");
    }

    console.log("📊 Fetching product prices from DB...");
    const dbProductPrices = await ProductModel.find(
      { _id: { $in: payload.items.map((x: { _id: string }) => x._id) } },
      "price"
    );
    console.log("✅ Fetched product prices:", dbProductPrices);

    // Create the order items array with prices from the DB
    const dbOrderItems = payload.items.map((x: { _id: string }) => {
      const product = dbProductPrices.find(
        (item) => item._id.toString() === x._id
      );
      if (!product) {
        throw new Error(`Product with ID ${x._id} not found.`);
      }
      return {
        ...x,
        product: x._id,
        price: product.price,
        _id: undefined, // Remove the _id for the order item
      };
    });

    console.log("🛒 Final order items:", dbOrderItems);

    // Calculate prices
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);
    console.log(
      "💰 Calculated Prices - Items:",
      itemsPrice,
      "Tax:",
      taxPrice,
      "Shipping:",
      shippingPrice,
      "Total:",
      totalPrice
    );

    // ✅ Create a new order with gstDetails & personalInfo
    const newOrder = new OrderModel({
      user: user?.id, // ✅ Ensure user field is included
      items: dbOrderItems,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      shippingAddress: payload.shippingAddress,
      paymentMethod: payload.paymentMethod,
      gstDetails: payload.gstDetails, // ✅ Include GST details
      personalInfo: payload.personalInfo, // ✅ Include personal info
      paymentIntentId: payload.paymentIntentId,
    });

    console.log("📝 Creating order in database...");
    const createdOrder = await newOrder.save();
    console.log("✅ Order created:", createdOrder);

    if (!createdOrder) {
      throw new Error("Failed to create order.");
    }

    // Update the order with payment information
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      { _id: createdOrder._id },
      {
        isPaid: true,
        paymentIntentId: payload.paymentIntentId,
      },
      { new: true }
    );

    console.log("💳 Payment success, order updated:", updatedOrder);

    return Response.json(
      { message: "Order has been created", order: updatedOrder },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("❌ Error creating order:", err.message);
    return Response.json({ message: err.message }, { status: 500 });
  }
});
