import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/lib/models/UserModel";

export const POST = async (request: NextRequest) => {
  const { name, email, password, mobileNumber } = await request.json();

  await dbConnect();

  try {
    // Check if email or mobileNumber already exists
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { mobileNumber }],
    });

    if (existingUser) {
      let message = "Email or mobile number already exists";

      if (existingUser.mobileNumber === mobileNumber) {
        message = "Mobile number already exists";
      } else if (existingUser.email === email) {
        message = "Email already exists";
      }

      return Response.json(
        { message },
        {
          status: 400,
        }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 5);

    // Create new user document
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
    });

    await newUser.save();

    return Response.json(
      { message: "User has been created" },
      {
        status: 201,
      }
    );
  } catch (err: any) {
    return Response.json(
      { message: err.message || "Internal server error" },
      {
        status: 500,
      }
    );
  }
};
