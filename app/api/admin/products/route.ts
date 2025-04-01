// import { auth } from "@/lib/auth";
// import dbConnect from "@/lib/dbConnect";
// import ProductModel from "@/lib/models/ProductModel";

// export const GET = auth(async (req: any) => {
//   if (!req.auth || !req.auth.user?.isAdmin) {
//     return Response.json(
//       { message: "unauthorized" },
//       {
//         status: 401,
//       }
//     );
//   }
//   await dbConnect();
//   const products = await ProductModel.find();
//   return Response.json(products);
// }) as any;

// export const POST = auth(async (req: any) => {
//   if (!req.auth || !req.auth.user?.isAdmin) {
//     return Response.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   await dbConnect();

//   try {
//     const body = await req.json();
//     console.log("bodyApi", body);

//     // Create and save the product
//     const product = new ProductModel({
//       ...body,
//       image: body.image || "", // Default to empty if not provided
//     });

//     await product.save();

//     return Response.json(
//       {
//         message: "Product created successfully",
//         product,
//       },
//       { status: 201 }
//     );
//   } catch (err: any) {
//     return Response.json(
//       { message: err.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }) as any;

// import { auth } from "@/lib/auth";
// import dbConnect from "@/lib/dbConnect";
// import ProductModel from "@/lib/models/ProductModel";

// export const GET = auth(async (req: any) => {
//   if (!req.auth || !req.auth.user?.isAdmin) {
//     return Response.json(
//       { message: "Unauthorized" },
//       {
//         status: 401,
//       }
//     );
//   }

//   await dbConnect();
//   const products = await ProductModel.find();
//   return Response.json(products);
// }) as any;

// export const POST = auth(async (req: any) => {
//   if (!req.auth || !req.auth.user?.isAdmin) {
//     return Response.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   await dbConnect();

//   try {
//     const body = await req.text(); // Use `req.text()` to handle raw data
//     const parsedBody = JSON.parse(body); // Parse the raw JSON string into an object

//     console.log("Received products:", parsedBody); // Log to check the format

//     // Check if the body contains an array of products
//     if (
//       !Array.isArray(parsedBody.products) ||
//       parsedBody.products.length === 0
//     ) {
//       return Response.json(
//         { message: "Invalid input, expected an array of products." },
//         { status: 400 }
//       );
//     }

//     // Define required fields (based on your schema)
//     const requiredFields = [
//       "name",
//       "productCode",
//       "weight",
//       "price_per_gram",
//       "info",
//       "slug",
//       "productCategory",
//       "price",
//       "description",
//       "countInStock",
//     ];

//     // Ensure each product in the array has required fields (basic validation)
//     const productsToSave = parsedBody.products.map((product: any) => {
//       // Ensure missing required fields are given dummy data or defaults
//       const processedProduct: any = {};

//       requiredFields.forEach((field) => {
//         if (!product[field]) {
//           // Add a fallback for the missing required fields
//           if (field === "slug") {
//             processedProduct[field] = product.name
//               ? product.name.replace(/\s+/g, "-").toLowerCase() // Generate slug from name
//               : "default-slug";
//           } else if (field === "productCategory") {
//             processedProduct[field] =
//               product.productCategory || "Uncategorized"; // Default to 'Uncategorized'
//           } else if (field === "countInStock") {
//             processedProduct[field] = 0; // Default numeric field to 0
//           } else if (field === "price") {
//             processedProduct[field] = 0; // Default price field to 0
//           } else {
//             processedProduct[field] =
//               `Dummy ${field.charAt(0).toUpperCase() + field.slice(1)}`; // Adding "Dummy" as a prefix to the missing field
//           }
//         } else {
//           // Ensure numeric fields are handled correctly
//           if (field === "countInStock" || field === "price") {
//             processedProduct[field] = Number(product[field]) || 0; // Ensure it's treated as a number
//           } else {
//             processedProduct[field] = product[field];
//           }
//         }
//       });

//       // Handling optional fields like category, image, and isFeatured
//       processedProduct.category = product.category || "Uncategorized"; // Default to 'Uncategorized' if not provided
//       processedProduct.image = product.image || ""; // Default to empty string if image is not provided
//       processedProduct.isFeatured = product.isFeatured || false; // Default to 'false' if not provided

//       return new ProductModel(processedProduct); // Return the product with all required and other fields
//     });

//     // Insert all products at once
//     const savedProducts = await ProductModel.insertMany(productsToSave);

//     return Response.json(
//       {
//         message: `${savedProducts.length} products created successfully.`,
//         products: savedProducts,
//       },
//       { status: 201 }
//     );
//   } catch (err: any) {
//     console.error("Error creating products:", err);
//     return Response.json(
//       { message: err.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }) as any;

// export const DELETE = auth(async (req: any) => {
//   if (!req.auth || !req.auth.user?.isAdmin) {
//     return Response.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   await dbConnect();

//   try {
//     const body = await req.json();
//     const { productIds } = body; // Expecting an array of product IDs
//     console.log("productIds", productIds);
//     if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
//       return Response.json(
//         { message: "No valid product IDs provided." },
//         { status: 400 }
//       );
//     }

//     // Delete all selected products in one go
//     const deletedProducts = await ProductModel.deleteMany({
//       _id: { $in: productIds },
//     });

//     return Response.json({
//       message: `${deletedProducts.deletedCount} products deleted successfully.`,
//     });
//   } catch (error: any) {
//     console.error("Error deleting products:", error);
//     return Response.json(
//       { message: error.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }) as any;

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import GoldDiamondProductPricingModel from "@/lib/models/GoldDiamondProductsPricingDetails";
import GoldPrice from "@/lib/models/GoldPriceSchema";
import ProductModel from "@/lib/models/ProductModel";

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  console.log("🔄 Connecting to DB and fetching products...");
  const products = await ProductModel.find().sort({ createdAt: -1 });
  console.log(`✅ Fetched ${products.length} products.`);

  console.log("🔄 Fetching latest gold prices...");
  const goldPrices = await GoldPrice.find({});
  console.log(`✅ Fetched ${goldPrices.length} gold prices:`, goldPrices);

  // Process and update each product
  const updatedProducts = await Promise.all(
    products.map(async (product) => {
      console.log(
        `🔍 Processing product: ${product.name} (${product.productCode})`
      );

      const pricingDetails = await GoldDiamondProductPricingModel.findOne({
        productCode: product.productCode,
      });

      if (!pricingDetails) {
        console.log(`⚠️ No pricing details found for ${product.productCode}`);
        return product;
      }

      console.log(
        `✅ Found pricing details for ${product.productCode}:`,
        pricingDetails
      );

      // Find current gold price based on goldPurity
      const goldPriceData = goldPrices.find(
        (g) => g.karat === product.goldPurity
      );
      const goldPrice = goldPriceData
        ? goldPriceData.price
        : pricingDetails.goldPrice;

      console.log(`💰 Gold Price for ${product.goldPurity}: ${goldPrice}`);

      // Calculate final price dynamically
      const finalPrice =
        pricingDetails.grossWeight * goldPrice +
        pricingDetails.makingCharge +
        pricingDetails.diamondTotal;

      console.log(
        `📊 Final Price Calculation for ${product.productCode}:`,
        `Gross Weight: ${pricingDetails.grossWeight}, `,
        `Gold Price: ${goldPrice}, `,
        `Making Charge: ${pricingDetails.makingCharge}, `,
        `Diamond Total: ${pricingDetails.diamondTotal}, `,
        `Final Price: ${finalPrice}`
      );

      // Update the product in the database
      await ProductModel.findByIdAndUpdate(product._id, {
        pricePerGram: pricingDetails.pricePerGram,
        goldPrice,
        grossWeight: pricingDetails.grossWeight,
        totalPrice: finalPrice,
      });

      console.log(`✅ Updated product ${product.productCode} in the database.`);

      return {
        ...product.toObject(),
        pricePerGram: pricingDetails.pricePerGram,
        goldPrice,
        grossWeight: pricingDetails.grossWeight,
        totalPrice: finalPrice, // Updated dynamically
      };
    })
  );

  // Sort so products with images appear first
  const sortedProducts = updatedProducts.sort((a, b) => {
    const hasImageA = a.image && a.image.startsWith("http");
    const hasImageB = b.image && b.image.startsWith("http");
    return hasImageB - hasImageA; // Products with image URLs come first
  });

  console.log("✅ Final sorted products list ready to be sent.");

  return Response.json(sortedProducts);
}) as any;

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await req.text();
    const parsedBody = JSON.parse(body);

    console.log("parsedBody", parsedBody);
    if (
      !Array.isArray(parsedBody.products) ||
      parsedBody.products.length === 0
    ) {
      return Response.json(
        { message: "Invalid input, expected an array of products." },
        { status: 400 }
      );
    }

    const productsToSave = parsedBody.products.map((product: any) => {
      const processedProduct: any = { ...product };

      // Automatically create slug if missing
      if (!processedProduct.slug && product.name) {
        processedProduct.slug = product.name
          .replace(/\s+/g, "-") // Replace spaces with hyphens
          .toLowerCase(); // Convert to lowercase
      }

      // Ensure `countInStock` and `price` default to 0 if missing
      processedProduct.countInStock = Number(product.countInStock) || 0;
      processedProduct.price = Number(product.price) || 0;

      // Ensure `images` is an array
      processedProduct.images = Array.isArray(product.images)
        ? product.images
        : product.image
          ? product.image.split(",").map((img: string) => img.trim())
          : [];

      // Set the first image as `image`
      processedProduct.image =
        processedProduct.images.length > 0 ? processedProduct.images[0] : "";

      return new ProductModel(processedProduct);
    });

    const savedProducts = await ProductModel.insertMany(productsToSave);

    return Response.json(
      {
        message: `${savedProducts.length} products created successfully.`,
        products: savedProducts,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error creating products:", err);
    return Response.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}) as any;

export const DELETE = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await req.json();
    const { productIds } = body;
    console.log("productIds", productIds);

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return Response.json(
        { message: "No valid product IDs provided." },
        { status: 400 }
      );
    }

    const deletedProducts = await ProductModel.deleteMany({
      _id: { $in: productIds },
    });

    return Response.json({
      message: `${deletedProducts.deletedCount} products deleted successfully.`,
    });
  } catch (error: any) {
    console.error("Error deleting products:", error);
    return Response.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}) as any;
