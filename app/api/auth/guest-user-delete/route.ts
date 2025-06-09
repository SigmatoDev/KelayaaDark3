import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/lib/models/UserModel";

export async function DELETE(req: Request) {
  try {
    const { mobileNumber, userId } = await req.json();

    if (!mobileNumber && !userId) {
      return NextResponse.json(
        { success: false, error: "Provide either mobileNumber or userId." },
        { status: 400 }
      );
    }

    await dbConnect();

    const query: any = {
      userType: "guest",
    };

    if (userId) {
      query._id = userId;
    } else if (mobileNumber) {
      query.mobileNumber = mobileNumber;
    }

    const deletedUser = await UserModel.findOneAndDelete(query);

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, error: "Guest user not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Guest user deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting guest user:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}
