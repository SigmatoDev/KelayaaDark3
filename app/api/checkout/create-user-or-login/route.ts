import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/lib/models/UserModel";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { fullName, email, mobileNumber, password } = await req.json();

    if (!email || !mobileNumber || !password || !fullName) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: "Email already exists. Please log in." },
        { status: 400 }
      );
    }

    const existingMobile = await UserModel.findOne({ mobileNumber });
    if (existingMobile) {
      return NextResponse.json(
        {
          success: false,
          error: "Mobile number already exists. Please log in.",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      name: fullName,
      email,
      mobileNumber,
      password: hashedPassword,
    });

    return NextResponse.json({ success: true, newAccount: true });
  } catch (error) {
    console.error("User creation error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}
