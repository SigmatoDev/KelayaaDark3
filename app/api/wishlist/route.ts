import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Types } from "mongoose";
import Wishlist from "@/lib/models/WishList";
import ProductModel from "@/lib/models/ProductModel";
import SetsProductModel from "@/lib/models/SetsProductsModel";

// ✅ Toggle Wishlist (Add/Remove)
export async function POST(req: Request) {
  await dbConnect();

  try {
    const { userId, productId } = await req.json();
    console.log("🆔 ids", userId, productId);

    if (!userId || !productId) {
      return NextResponse.json(
        { message: "Missing userId or productId" },
        { status: 400 }
      );
    }

    const userObjectId = new Types.ObjectId(userId);
    const productObjectId = new Types.ObjectId(productId);

    // ✅ Check if product exists in either ProductModel or SetsProductModel
    const [isProduct, isSet] = await Promise.all([
      ProductModel.exists({ _id: productObjectId }),
      SetsProductModel.exists({ _id: productObjectId }),
    ]);

    if (!isProduct && !isSet) {
      return NextResponse.json(
        { message: "Product not found in either model" },
        { status: 404 }
      );
    }

    // ✅ Find the user's wishlist
    let wishlist = await Wishlist.findOne({ userId: userObjectId });

    if (!wishlist) {
      // ✅ Create new wishlist if not exists
      wishlist = await Wishlist.create({
        userId: userObjectId,
        productIds: [productObjectId],
      });

      return NextResponse.json(
        { message: "Added to wishlist", status: true, productId },
        { status: 200 }
      );
    }

    // ✅ Check if product already exists
    const productIndex = wishlist.productIds.findIndex((id: any) =>
      id.equals(productObjectId)
    );

    if (productIndex > -1) {
      // ✅ Product exists, remove it
      wishlist.productIds.splice(productIndex, 1);
    } else {
      // ✅ Product doesn't exist, add it
      wishlist.productIds.push(productObjectId);
    }

    await wishlist.save(); // ✅ Save the changes

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
    console.error("❌ Wishlist POST Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// ✅ Check Wishlist Status (For a Single Product)
// ✅ Fetch Wishlist Details (for a user)

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const userId = req.nextUrl.searchParams.get("userId");

    console.log("📥 userId received:", userId);

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    const objectUserId = new Types.ObjectId(userId);
    console.log("🧾 Converted to ObjectId:", objectUserId);

    const wishlist = await Wishlist.findOne({ userId: objectUserId });
    if (!wishlist) {
      console.log("📭 No wishlist found");
      return NextResponse.json([]);
    }

    console.log("✅ Wishlist found:", wishlist);

    const rawProductIds = (wishlist.productIds || []).slice().reverse();

    if (rawProductIds.length === 0) {
      console.log("📭 No productIds in wishlist");
      return NextResponse.json([]);
    }

    // Convert all productIds to ObjectId (safely)
    const productIds = rawProductIds.map((id: any) =>
      typeof id === "string" ? new Types.ObjectId(id) : id
    );

    console.log("🔁 Converted productIds:", productIds);

    // Query both models
    const [products, sets] = await Promise.all([
      ProductModel.find({ _id: { $in: productIds } }),
      SetsProductModel.find({ _id: { $in: productIds } }),
    ]);

    const all = [...products, ...sets];

    console.log("📦 Products to return:", all);

    return NextResponse.json({
      status: true,
      message: "Wishlist fetched successfully",
      products: all, // Array of products with required fields
    });
  } catch (err) {
    console.error("❌ Error in GET /api/wishlist", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

//remove from wishlist
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

    // Remove productId if it exists
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
