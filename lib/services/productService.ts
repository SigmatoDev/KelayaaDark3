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

const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const groupByCategory = (products: any[]) => {
  const categoryMap = new Map<string, any[]>();

  products.forEach((product) => {
    if (!categoryMap.has(product.productCategory)) {
      categoryMap.set(product.productCategory, []);
    }
    categoryMap.get(product.productCategory)!.push(product);
  });

  // Shuffle products within each category
  categoryMap.forEach((products, category) => {
    categoryMap.set(category, shuffleArray(products));
  });

  return categoryMap;
};

const interleaveCategoriesStrict = (categoryMap: Map<string, any[]>) => {
  const categoryQueues = Array.from(categoryMap.entries()).map(
    ([key, value]) => ({
      category: key,
      products: value,
    })
  );

  const result: any[] = [];
  let categoryIndex = 0;

  while (categoryQueues.some((q) => q.products.length > 0)) {
    let attempts = 0;
    while (attempts < categoryQueues.length) {
      const queue = categoryQueues[categoryIndex % categoryQueues.length];
      if (queue.products.length > 0) {
        result.push(queue.products.shift());
        categoryIndex++; // Move to the next category in round-robin
        break;
      }
      categoryIndex++; // Try next category
      attempts++;
    }
  }

  return result;
};

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

    // Fetch distinct product categories
    const categories = await ProductModel.find().distinct("productCategory");

    const queryFilter =
      q && q !== "all"
        ? {
            name: {
              $regex: q,
              $options: "i",
            },
          }
        : {};

    // Ensure all categories are included if "all" is selected
    const categoryFilter =
      productCategory && productCategory !== "all"
        ? { productCategory }
        : { productCategory: { $in: categories } }; // Fetch all categories

    const ratingFilter =
      rating && rating !== "all"
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};

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

    // Fetch all matching products first
    let products = await ProductModel.aggregate([
      {
        $match: {
          ...queryFilter,
          ...categoryFilter,
          ...priceFilter,
          ...ratingFilter,
        },
      },
      {
        $addFields: {
          hasValidImage: {
            $cond: {
              if: {
                $regexMatch: {
                  input: "$image",
                  regex: "^(http://|https://)",
                  options: "i",
                },
              },
              then: 1,
              else: 0,
            },
          },
        },
      },
      { $sort: { hasValidImage: -1, ...order } }, // Sort by images and order
      { $project: { reviews: 0, hasValidImage: 0 } }, // Exclude unnecessary fields
    ]);

    const countProducts = products.length;

    // Shuffle if multiple categories exist
    const uniqueCategories = new Set(products.map((p) => p.productCategory));

    if (uniqueCategories.size > 1) {
      const categoryMap = groupByCategory(products);
      products = interleaveCategoriesStrict(categoryMap);
    } else {
      // If only one category, shuffle normally
      products = shuffleArray(products);
    }

    // Apply pagination *after* shuffling
    const paginatedProducts = products.slice(
      PAGE_SIZE * (Number(page) - 1),
      PAGE_SIZE * Number(page)
    );

    return {
      products: paginatedProducts as Product[],
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
