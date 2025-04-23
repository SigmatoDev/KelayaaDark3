import dbConnect from "@/lib/dbConnect";
import { auth } from "@/lib/auth";
import BeadsProductModel from "@/lib/models/BeadsProductModel";

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await req.json();

    if (!Array.isArray(body.products) || body.products.length === 0) {
      return Response.json(
        { message: "Invalid input, expected products array." },
        { status: 400 }
      );
    }

    const productsToSave = body.products.map((product: any) => {
      const images = Array.isArray(product.images)
        ? product.images
        : product.image?.split(",").map((img: string) => img.trim()) || [];

      return new BeadsProductModel({
        name: product.name ?? "",
        productCode: product.productCode ?? "",
        netWeightCarat: Number(product.netWeightCarat ?? 0),
        price: Number(product.price ?? 0),
        size: product.size ?? "",
        length: product.length ?? "",
        info: product.info ?? "",
        inventory_no_of_line: Number(product.inventory_no_of_line ?? 0),
        countInStock: Number(product?.countInStock),
        pricePerLine: Number(product.pricePerLine ?? 0),
        images,
        image: images[0] ?? "",
        materialType: "Beads",
      });
    });

    const saved = await BeadsProductModel.insertMany(productsToSave);

    return Response.json(
      {
        message: `${saved.length} beads products created successfully.`,
        products: saved,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error creating beads products:", err);
    return Response.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}) as any;
