import { auth } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export const POST = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { amount, description, customerName, customerAddress } =
      await req.json();

    if (!amount || typeof amount !== "number") {
      return Response.json(
        { error: "Invalid amount provided" },
        { status: 400 }
      );
    }

    if (!description || typeof description !== "string") {
      return Response.json(
        { error: "A valid description is required for export transactions." },
        { status: 400 }
      );
    }

    if (!customerName || !customerAddress) {
      return Response.json(
        {
          error:
            "Customer name and address are required for export transactions.",
        },
        { status: 400 }
      );
    }
    console.log("amount",amount)

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
      payment_method_types: ["card"],
      description, // Include description
      shipping: {
        name: customerName,
        address: {
          line1: customerAddress.line1,
          line2: customerAddress.line2 || "",
          city: customerAddress.city,
          state: customerAddress.state,
          postal_code: customerAddress.postal_code,
          country: customerAddress.country,
        },
      },
    });

    return Response.json({ paymentIntent }, { status: 200 });
  } catch (error: any) {
    console.error("Error creating payment intent:", error.message);
    return Response.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
});
