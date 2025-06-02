import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import PasswordOtpModel from "@/lib/models/PasswordOtpModel";

export const POST = async (req: Request) => {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: "Missing data" }, { status: 400 });
    }

    await dbConnect();

    const record = await PasswordOtpModel.findOne({ email, otp });

    if (!record) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    if (record.expiresAt < new Date()) {
      await PasswordOtpModel.deleteOne({ _id: record._id });
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    await PasswordOtpModel.deleteOne({ _id: record._id }); // Invalidate OTP after use
    return NextResponse.json({ message: "OTP verified" }, { status: 200 });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
