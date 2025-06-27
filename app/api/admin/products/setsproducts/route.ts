import { auth } from "@/lib/auth"; // your authentication middleware
import dbConnect from "@/lib/dbConnect";
import SetsProductModel from "@/lib/models/SetsProductsModel";

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await req.json();

    const {
      name,
      productCode,
      description,
      image,
      images,
      items,
      subCategories,
      collectionType,
      countInStock,
    } = body;

    let price = 0;

    const enrichedItems = items.map((item: any) => {
      const {
        diamondPrice = 0,
        goldPrice = 0,
        grossWeight = 0,
        pricePerGram = 0,
        makingCharges = 0,
      } = item.pricing;

      const diamondTotal = +diamondPrice;
      const goldTotal =
        (+grossWeight || 0) * (+pricePerGram || 0) + (+goldPrice || 0);
      const totalPrice = diamondTotal + goldTotal + (+makingCharges || 0);
      const gst = +(0.03 * totalPrice).toFixed(2);

      price += totalPrice + gst;

      return {
        ...item,
        pricing: {
          ...item.pricing,
          diamondTotal,
          goldTotal,
          totalPrice,
          gst,
        },
      };
    });

    const newProduct = await SetsProductModel.create({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      productCode,
      description,
      image,
      images,
      subCategories,
      collectionType,
      countInStock,
      materialType: "gold",
      productType: "Sets",
      price,
      items: enrichedItems,
    });

    return Response.json(
      { message: "Set product created", product: newProduct },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating set product:", err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
});
