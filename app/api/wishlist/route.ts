import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Types } from "mongoose";
import Wishlist from "@/lib/models/WishList";
import ProductModel from "@/lib/models/ProductModel";
import SetsProductModel from "@/lib/models/SetsProductsModel";
import BanglesProductModel from "@/lib/models/BanglesProductSchema";
import BeadsProductModel from "@/lib/models/BeadsProductModel";

// ✅ Toggle Wishlist (Add/Remove)
export async function POST(req: Request) {
  await dbConnect();

  try {
    const { userId, productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { message: "Missing userId or productId" },
        { status: 400 }
      );
    }

    const userObjectId = new Types.ObjectId(userId);
    const productObjectId = new Types.ObjectId(productId);

    // ✅ Check if product exists in any model
    const [isProduct, isSet, isBangle, isBead] = await Promise.all([
      ProductModel.exists({ _id: productObjectId }),
      SetsProductModel.exists({ _id: productObjectId }),
      BanglesProductModel.exists({ _id: productObjectId }),
      BeadsProductModel.exists({ _id: productObjectId }),
    ]);

    if (!isProduct && !isSet && !isBangle && !isBead) {
      return NextResponse.json(
        { message: "Product not found in any model" },
        { status: 404 }
      );
    }

    let wishlist = await Wishlist.findOne({ userId: userObjectId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId: userObjectId,
        productIds: [productObjectId],
      });

      return NextResponse.json(
        { message: "Added to wishlist", status: true, productId },
        { status: 200 }
      );
    }

    const productIndex = wishlist.productIds.findIndex((id: any) =>
      id.equals(productObjectId)
    );

    if (productIndex > -1) {
      wishlist.productIds.splice(productIndex, 1);
    } else {
      wishlist.productIds.push(productObjectId);
    }

    await wishlist.save();

    return NextResponse.json(
      {
        message:
          productIndex > -1 ? "Removed from wishlist" : "Added to wishlist",
        status: productIndex === -1,
        productId,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// ✅ Get Wishlist for a user
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    const objectUserId = new Types.ObjectId(userId);
    const wishlist = await Wishlist.findOne({ userId: objectUserId });

    if (!wishlist || wishlist.productIds.length === 0) {
      return NextResponse.json({
        status: true,
        message: "Wishlist is empty",
        products: [],
      });
    }

    const productIds = wishlist.productIds
      .slice()
      .reverse()
      .map((id: any) => (typeof id === "string" ? new Types.ObjectId(id) : id));

    const [products, sets, bangles, beads] = await Promise.all([
      ProductModel.find({ _id: { $in: productIds } }),
      SetsProductModel.find({ _id: { $in: productIds } }),
      BanglesProductModel.find({ _id: { $in: productIds } }),
      BeadsProductModel.find({ _id: { $in: productIds } }),
    ]);

    const all = [...products, ...sets, ...bangles, ...beads];

    return NextResponse.json({
      status: true,
      message: "Wishlist fetched successfully",
      products: all,
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Internal Server Error", status: false },
      { status: 500 }
    );
  }
}

// ✅ Remove from wishlist
export async function DELETE(req: Request) {
  await dbConnect();
  try {
    const { userId, productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { message: "Missing userId or productId" },
        { status: 400 }
      );
    }

    const userObjectId = new Types.ObjectId(userId);
    const productObjectId = new Types.ObjectId(productId);

    const wishlist = await Wishlist.findOne({ userId: userObjectId });

    if (!wishlist) {
      return NextResponse.json(
        { message: "Wishlist not found", status: false },
        { status: 404 }
      );
    }

    wishlist.productIds = wishlist.productIds.filter(
      (id: Types.ObjectId) => !id.equals(productObjectId)
    );

    await wishlist.save();

    return NextResponse.json(
      { message: "Removed from wishlist", status: true, productId },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error",
        error: (error as Error).message,
        status: false,
      },
      { status: 500 }
    );
  }
}
