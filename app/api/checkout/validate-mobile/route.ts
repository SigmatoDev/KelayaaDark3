import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";
import UserModel from "@/lib/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

type ShippingAddress = {
  // Define the structure of ShippingAddress
};

type BillingDetails = {
  // Define the structure of BillingDetails
};

type ResponseData = {
  success: boolean;
  userData?: {
    name: string;
    email: string;
    mobileNumber: string;
    isAdmin: boolean;
    provider: string;
    shippingAddress?: ShippingAddress;
    billingDetails?: BillingDetails;
  };
};

export async function POST(req: NextRequest) {
  const { mobileNumber } = await req.json(); // Parse JSON body from request

  if (!mobileNumber) {
    return NextResponse.json(
      { success: false, message: "Mobile number is required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect(); // Connect to your MongoDB database

    // Fetch the user based on the mobile number
    const user = await UserModel.findOne({ mobileNumber }).exec();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if there is any order associated with this user and mobile number
    const order = await OrderModel.findOne({
      "personalInfo.mobileNumber": mobileNumber,
    })
      .populate("shippingAddress")
      .populate("billingDetails")
      .exec();

    let shippingAddress = null;
    let billingDetails = null;

    if (order) {
      shippingAddress = order.shippingAddress;
      billingDetails = order.billingDetails;
    }

    // Return the user data along with the shipping and billing details (if available)
    const response: ResponseData = {
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        isAdmin: user.isAdmin,
        provider: user.provider,
        shippingAddress,
        billingDetails,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
