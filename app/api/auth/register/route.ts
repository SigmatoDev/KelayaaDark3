import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/lib/models/UserModel";

export const POST = async (request: NextRequest) => {
  const { name, email, password } = await request.json();
  console.log("register", name, email, password);
  await dbConnect();
  const hashedPassword = await bcrypt.hash(password, 5);
  const newUser = new UserModel({
    name,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    return Response.json(
      { message: "User has been created" },
      {
        status: 201,
      }
    );
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    );
  }
};
