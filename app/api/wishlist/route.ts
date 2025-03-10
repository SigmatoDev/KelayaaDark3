import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Types } from "mongoose";
import Wishlist from "@/lib/models/WishList";

// ✅ Toggle Wishlist (Add/Remove)
export async function POST(req: Request) {
  await dbConnect();
  try {
    const { userId, productId } = await req.json();
    console.log("ids", userId, productId);
    if (!userId || !productId) {
      return NextResponse.json(
        { message: "Missing userId or productId" },
        { status: 400 }
      );
    }

    const userObjectId = new Types.ObjectId(userId);
    const productObjectId = new Types.ObjectId(productId);

    // ✅ Find the user's wishlist
    let wishlist = await Wishlist.findOne({ userId: userObjectId });

    if (!wishlist) {
      // ✅ Create a new wishlist if it doesn’t exist
      wishlist = await Wishlist.create({
        userId: userObjectId,
        productIds: [productObjectId], // Fix: Store as an array
      });
      return NextResponse.json(
        { message: "Added to wishlist", status: true },
        { status: 200 }
      );
    }

    // ✅ Check if product already exists in wishlist
    const productIndex = wishlist.productIds.findIndex(
      (id: { equals: (arg0: Types.ObjectId) => any }) =>
        id.equals(productObjectId)
    );

    if (productIndex > -1) {
      // ✅ Product exists, so remove it
      wishlist.productIds.splice(productIndex, 1);
    } else {
      // ✅ Product doesn't exist, add it
      wishlist.productIds.push(productObjectId);
    }

    await wishlist.save(); // ✅ Save updated wishlist

    return NextResponse.json(
      {
        message:
          productIndex > -1 ? "Removed from wishlist" : "Added to wishlist",
        status: productIndex === -1,
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

// ✅ Check Wishlist Status (For a Single Product)
// ✅ Fetch Wishlist Details (for a user)
export async function GET(req: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    const userObjectId = new Types.ObjectId(userId);

    // ✅ Fetch user's wishlist
    const wishlist = await Wishlist.findOne({ userId: userObjectId }).populate(
      "productIds"
    );

    if (!wishlist || wishlist.productIds.length === 0) {
      return NextResponse.json({
        status: false,
        message: "Your wishlist is empty",
        products: [],
      });
    }

    // Get the product details from the productIds array
    const products = wishlist.productIds.map((product: any) => ({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      slug: product.slug,
    }));

    return NextResponse.json({ status: true, products }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
