import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import UserModel from "@/lib/models/UserModel";

export const POST = async (request: NextRequest) => {
  try {
    const { email, password } = await request.json();

    await dbConnect();

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User with this email does not exist" },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();

    return NextResponse.json({ message: "Password reset successful" });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
};
