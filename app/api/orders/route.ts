import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModel, { OrderItem } from "@/lib/models/OrderModel";
import ProductModel from "@/lib/models/ProductModel";
import { round2 } from "@/lib/utils";

const calcPrices = (orderItems: OrderItem[]) => {
  // Calculate the items price
  const itemsPrice = round2(
    orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  // Calculate the shipping price
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  // Calculate the tax price
  const taxPrice = round2(Number(0.15 * itemsPrice));
  // Calculate the total price
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

export const POST = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json({ message: "unauthorized" }, { status: 401 });
  }

  const { user } = req.auth;
  try {
    const payload = await req.json();
    await dbConnect();

    // Get the product prices from the database
    const dbProductPrices = await ProductModel.find(
      { _id: { $in: payload.items.map((x: { _id: string }) => x._id) } },
      "price"
    );

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

    // Calculate prices
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    // Create a new order
    const newOrder = new OrderModel({
      items: dbOrderItems,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      shippingAddress: payload.shippingAddress,
      paymentMethod: payload.paymentMethod,
      user: user._id,
      paymentIntentId:payload.paymentIntentId,
    });

    // Save the order to the database
    const createdOrder = await newOrder.save();

    // Now that payment is successful (add your payment logic here, such as paymentIntent creation), update the order as paid
    const paymentIntentId = payload.paymentIntentId; // Ensure you pass this ID

    // Update the order with payment information
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      { _id: createdOrder._id },
      {
        isPaid: true,
        paymentIntentId, // Save the payment intent ID
      },
      { new: true }
    );

    return Response.json(
      { message: "Order has been created", order: updatedOrder },
      { status: 201 }
    );
  } catch (err: any) {
    return Response.json({ message: err.message }, { status: 500 });
  }
});
