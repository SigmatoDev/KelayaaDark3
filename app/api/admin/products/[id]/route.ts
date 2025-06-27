import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import BanglesProductModel from "@/lib/models/BanglesProductSchema";
import BeadsProductModel from "@/lib/models/BeadsProductModel";
import ProductModel from "@/lib/models/ProductModel";
import SetsProductModel from "@/lib/models/SetsProductsModel";

export const GET = auth(async (...args: any) => {
  const [req, { params }] = args;

  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  // Fetch data from all models by product ID
  const [products, set, bangle, bead] = await Promise.all([
    ProductModel.findById(params.id),
    SetsProductModel.findOne({ _id: params.id }),
    BanglesProductModel.findOne({ _id: params.id }),
    BeadsProductModel.findOne({ _id: params.id }),
  ]);

  // If none of the products are found, return 404
  if (!products && !set && !bangle && !bead) {
    return Response.json({ message: "Product not found" }, { status: 404 });
  }

  // Determine which product to return based on the available data
  let foundProduct = null;

  if (products) {
    foundProduct = { ...products.toObject(), type: "product" };
  } else if (set) {
    foundProduct = { ...set.toObject(), type: "set" };
  } else if (bangle) {
    foundProduct = { ...bangle.toObject(), type: "bangle" };
  } else if (bead) {
    foundProduct = { ...bead.toObject(), type: "bead" };
  }

  return Response.json(foundProduct);
}) as any;

export const PUT = auth(async (...args: any) => {
  const [req, { params }] = args;
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: "unauthorized" },
      {
        status: 401,
      }
    );
  }

  const {
    name,
    slug,
    price,
    category,
    productCategory,
    image,
    brand,
    description,
    weight,
    price_per_gram,
    productCode,
    info,
  } = await req.json();

  try {
    await dbConnect();

    const product = await ProductModel.findById(params.id);
    if (product) {
      product.name = name;
      product.slug = slug;
      product.weight = weight;
      product.price_per_gram = price_per_gram;
      product.productCode = productCode;
      product.info = info;
      product.price = price;
      product.category = category;
      product.productCategory = productCategory;
      product.image = image;
      product.brand = brand;
      product.description = description;

      const updatedProduct = await product.save();

      return Response.json(updatedProduct);
    } else {
      return Response.json(
        { message: "Product not found" },
        {
          status: 404,
        }
      );
    }
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    );
  }
}) as any;

// export const DELETE = auth(async (...args: any) => {
//   const [req, { params }] = args;

//   if (!req.auth || !req.auth.user?.isAdmin) {
//     return Response.json(
//       { message: 'unauthorized' },
//       {
//         status: 401,
//       },
//     );
//   }

//   try {
//     await dbConnect();
//     const product = await ProductModel.findById(params.id);
//     if (product) {
//       await product.deleteOne();
//       return Response.json({ message: 'Product deleted successfully' });
//     } else {
//       return Response.json(
//         { message: 'Product not found' },
//         {
//           status: 404,
//         },
//       );
//     }
//   } catch (err: any) {
//     return Response.json(
//       { message: err.message },
//       {
//         status: 500,
//       },
//     );
//   }
// }) as any;
