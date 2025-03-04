import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/lib/models/ProductModel";
import RingProductModel from "@/lib/models/RingProductModel"; // Import your RingProduct model

export const GET = auth(async (...args: any) => {
  const [req, { params }] = args;
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: "unauthorized" },
      {
        status: 401,
      }
    );
  }
  await dbConnect();
  const product = await ProductModel.findById(params.id);
  if (!product) {
    return Response.json(
      { message: "product not found" },
      {
        status: 404,
      }
    );
  }
  return Response.json(product);
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
