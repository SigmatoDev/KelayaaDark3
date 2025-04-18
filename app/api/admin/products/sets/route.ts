// import dbConnect from "@/lib/dbConnect";
// import { auth } from "@/lib/auth";
// import SetsProductModel from "@/lib/models/SetsProductsModel";

// export const POST = auth(async (req: any) => {
//   if (!req.auth || !req.auth.user?.isAdmin) {
//     return Response.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   await dbConnect();

//   try {
//     const body = await req.json(); // ✅ Fix: Let Next.js parse JSON

//     console.log("bodt", body);
//     if (!Array.isArray(body.products) || body.products.length === 0) {
//       return Response.json(
//         { message: "Invalid input, expected an array of products." },
//         { status: 400 }
//       );
//     }

//     const productsToSave = body.products.map((product: any) => {
//       const processedProduct: any = {
//         name: product.name ?? null,
//         productCode: product.productCode ?? null,
//         description: product.description ?? null,
//         slug:
//           product.slug ??
//           (product.name
//             ? product.name.toLowerCase().replace(/\s+/g, "-")
//             : null),
//         subCategories: Array.isArray(product.subCategories)
//           ? product.subCategories
//           : typeof product.subCategories === "string"
//             ? product.subCategories
//                 .split("/")
//                 .map((s: string) => s.trim())
//                 .filter((s: string) => s.length > 0)
//             : [],

//         price: product.price != null ? Number(product.price) : null,
//         countInStock:
//           product.countInStock != null ? Number(product.countInStock) : null,
//         productType: "Sets",
//       };

//       processedProduct.images = Array.isArray(product.images)
//         ? product.images
//         : product.image?.split(",").map((img: string) => img.trim()) || [];

//       processedProduct.image =
//         processedProduct.images.length > 0 ? processedProduct.images[0] : null;

//       processedProduct.items = Array.isArray(product.items)
//         ? product.items.map((item: any) => ({
//             productCategory: item.productCategory ?? null,
//             gemCut: item.gemCut ?? null,
//             carats: item.carats != null ? Number(item.carats) : null,
//             clarity: item.clarity ?? null,
//             color: item.color ?? null,
//             goldPurity: item.goldPurity ?? null,
//           }))
//         : [];

//       return new SetsProductModel(processedProduct);
//     });

//     const saved = await SetsProductModel.insertMany(productsToSave);

//     return Response.json(
//       {
//         message: `${saved.length} set products created successfully.`,
//         products: saved,
//       },
//       { status: 201 }
//     );
//   } catch (err: any) {
//     console.error("Error creating set products:", err);
//     return Response.json(
//       { message: err.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }) as any;

import dbConnect from "@/lib/dbConnect";
import { auth } from "@/lib/auth";
import BanglesProductModel from "@/lib/models/BanglesProductSchema";

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await req.json(); // ✅ Fix: Let Next.js parse JSON

    console.log("bodt", body);
    if (!Array.isArray(body.products) || body.products.length === 0) {
      return Response.json(
        { message: "Invalid input, expected an array of products." },
        { status: 400 }
      );
    }

    const productsToSave = body.products.map((product: any) => {
      const processedProduct: any = {
        name: product.name ?? null,
        productCode: product.productCode ?? null,
        description: product.description ?? null,
        slug:
          product.slug ??
          (product.name
            ? product.name.toLowerCase().replace(/\s+/g, "-")
            : null),
        subCategories: Array.isArray(product.subCategories)
          ? product.subCategories
          : typeof product.subCategories === "string"
            ? product.subCategories
                .split("/")
                .map((s: string) => s.trim())
                .filter((s: string) => s.length > 0)
            : [],

        price: product.price != null ? Number(product.price) : null,
        countInStock:
          product.countInStock != null ? Number(product.countInStock) : null,
        productType: "Bangles",
        size: "",
      };

      processedProduct.images = Array.isArray(product.images)
        ? product.images
        : product.image?.split(",").map((img: string) => img.trim()) || [];

      processedProduct.image =
        processedProduct.images.length > 0 ? processedProduct.images[0] : null;

      processedProduct.items = Array.isArray(product.items)
        ? product.items.map((item: any) => ({
            productCategory: item.productCategory ?? null,
            gemCut: item.gemCut ?? null,
            carats: item.carats != null ? Number(item.carats) : null,
            clarity: item.clarity ?? null,
            color: item.color ?? null,
            goldPurity: item.goldPurity ?? null,
          }))
        : [];

      return new BanglesProductModel(processedProduct);
    });

    const saved = await BanglesProductModel.insertMany(productsToSave);

    return Response.json(
      {
        message: `${saved.length} set products created successfully.`,
        products: saved,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error creating set products:", err);
    return Response.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}) as any;
