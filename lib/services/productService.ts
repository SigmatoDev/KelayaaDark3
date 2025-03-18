import { cache } from "react";

import dbConnect from "@/lib/dbConnect";
import ProductModel, { Product } from "@/lib/models/ProductModel";

export const revalidate = 3600;

const getLatest = cache(async () => {
  await dbConnect();

  // Fetch all products sorted by latest (_id in descending order)
  const allProducts = await ProductModel.find({})
    .sort({ _id: -1 }) // Get the latest products first
    .lean(); // Convert to plain JavaScript objects

  // Sort: Products with image URLs first
  const sortedProducts = allProducts.sort((a, b) => {
    const hasImageA = a.image && a.image.startsWith("http");
    const hasImageB = b.image && b.image.startsWith("http");

    return hasImageB - hasImageA; // Products with images come first
  });

  // Return the top 8 sorted products
  return sortedProducts.slice(0, 8) as Product[];
});

const getTopRated = cache(async () => {
  await dbConnect();

  // Fetch all products sorted by highest rating first
  const allProducts = await ProductModel.find({})
    .sort({ rating: -1 }) // Sort by rating in descending order
    .lean(); // Convert to plain JavaScript objects

  // Sort: Products with image URLs first
  const sortedProducts = allProducts.sort((a, b) => {
    const hasImageA = a.image && a.image.startsWith("http");
    const hasImageB = b.image && b.image.startsWith("http");

    return hasImageB - hasImageA; // Products with images come first
  });

  // Return the top 8 sorted products
  return sortedProducts.slice(0, 8) as Product[];
});

// intentionally disable Next.js Cache to better demo
const getFeatured = async () => {
  await dbConnect();

  // Fetch all featured products
  const allProducts = await ProductModel.find({ isFeatured: true }).lean();

  // Sort: Products with image URLs first
  const sortedProducts = allProducts.sort((a, b) => {
    const hasImageA = a.image && a.image.startsWith("http");
    const hasImageB = b.image && b.image.startsWith("http");

    return hasImageB - hasImageA; // Products with images come first
  });

  // Return the top 3 sorted featured products
  return sortedProducts.slice(0, 3) as Product[];
};

// const getBySlug = cache(async (slug: string) => {
//   await dbConnect();
//   const product = await ProductModel.findOne({ slug }).lean();
//   return product as Product;
// });

const getBySlug = cache(async (slug: string) => {
  await dbConnect();

  // Fetch the product by slug
  const product = (await ProductModel.findOne({
    slug,
  }).lean()) as Product | null;

  // If product doesn't exist, return null
  if (!product) return null;

  // If product has a valid image URL, return it
  if (product.image && product.image.startsWith("http")) {
    return product;
  }

  // If product has no valid image, try finding another with the same slug that has an image
  const alternativeProduct = (await ProductModel.findOne({
    slug,
    image: { $regex: /^http/ }, // Find a product with an image URL
  }).lean()) as Product | null;

  return alternativeProduct || product;
});

const PAGE_SIZE = 10;
const getByQuery = cache(
  async ({
    q,
    productCategory,
    sort,
    price,
    rating,
    page = "1",
  }: {
    q: string;
    productCategory: string;
    price: string;
    rating: string;
    sort: string;
    page: string;
  }) => {
    await dbConnect();

    const queryFilter =
      q && q !== "all"
        ? {
            name: {
              $regex: q,
              $options: "i",
            },
          }
        : {};
    const categoryFilter =
      productCategory && productCategory !== "all" ? { productCategory } : {};
    const ratingFilter =
      rating && rating !== "all"
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    // 10-50
    const priceFilter =
      price && price !== "all"
        ? price.includes("-")
          ? {
              price: {
                $gte: parseFloat(price.split("-")[0]),
                $lte: parseFloat(price.split("-")[1]),
              },
            }
          : {
              price: parseFloat(price),
            }
        : {};

    const order: Record<string, 1 | -1> =
      sort === "lowest"
        ? { price: 1 }
        : sort === "highest"
          ? { price: -1 }
          : sort === "toprated"
            ? { rating: -1 }
            : { _id: -1 };

    const categories = await ProductModel.find().distinct("productCategory");
    const products = await ProductModel.find(
      {
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
      },
      "-reviews"
    )
      .sort(order)
      .skip(PAGE_SIZE * (Number(page) - 1))
      .limit(PAGE_SIZE)
      .lean();

    const countProducts = await ProductModel.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });

    return {
      products: products as Product[],
      countProducts,
      page,
      pages: Math.ceil(countProducts / PAGE_SIZE),
      categories,
    };
  }
);

// const getCategories = cache(async () => {
//   await dbConnect();
//   const categories = await ProductModel.find().distinct("productCategory");
//   return categories;
// });

const getCategories = cache(async () => {
  await dbConnect();

  // Fetch distinct categories
  const categories = await ProductModel.find().distinct("productCategory");

  // Fetch categories that have at least one product with an image URL
  const categoriesWithImages = await ProductModel.aggregate([
    {
      $match: { image: { $regex: /^http/ } }, // Find products with valid image URLs
    },
    {
      $group: { _id: "$productCategory" }, // Group by category
    },
  ]);

  // Create a Set for quick lookup
  const categoriesWithImagesSet = new Set(
    categoriesWithImages.map((c) => c._id)
  );

  // Sort: Categories with images come first
  const sortedCategories = categories.sort((a, b) => {
    const hasImageA = categoriesWithImagesSet.has(a);
    const hasImageB = categoriesWithImagesSet.has(b);

    return Number(hasImageB) - Number(hasImageA); // Convert boolean to number (true → 1, false → 0)
  });

  return sortedCategories;
});

const productService = {
  getLatest,
  getFeatured,
  getBySlug,
  getByQuery,
  getCategories,
  getTopRated,
};

export default productService;
