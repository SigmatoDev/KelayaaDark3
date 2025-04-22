import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/lib/models/UserModel";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, mobileNumber, password, fullName } = await req.json(); // Accept fullName also

    await dbConnect();

    let user = await UserModel.findOne({ email });

    if (!user) {
      // No user, create a new account
      const hashedPassword = await bcrypt.hash(password || "guestpassword", 10);

      user = await UserModel.create({
        name: fullName || mobileNumber || email, // Prefer fullName if available
        email,
        mobileNumber, // Save mobile separately
        password: hashedPassword,
      });

      return NextResponse.json({ success: true, newAccount: true });
    }

    // User exists already
    return NextResponse.json({ success: true, newAccount: false });
  } catch (error) {
    console.error("User creation error", error);
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}
