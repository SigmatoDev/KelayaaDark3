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

  // Filter out products with invalid or missing image URLs
  const validProducts = allProducts.filter(
    (product) => product.image && /^https?:\/\//.test(product.image)
  );

  // Shuffle the filtered products
  const shuffledProducts = shuffleArray(validProducts);

  // Return the top 8 shuffled products
  return shuffledProducts.slice(0, 8) as unknown as Product[];
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
  return sortedProducts.slice(0, 8) as unknown as Product[];
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
  return sortedProducts.slice(0, 3) as unknown as Product[];
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

const getByProductCode = cache(async (productCode: string) => {
  await dbConnect();

  // Fetch the product by productCode
  const product = (await ProductModel.findOne({
    productCode,
  }).lean()) as Product | null;

  if (!product) return null;

  // If product has a valid image URL, return it
  if (product.image && product.image.startsWith("http")) {
    return product;
  }

  // If product has no valid image, try finding another with the same productCode that has an image
  const alternativeProduct = (await ProductModel.findOne({
    productCode,
    image: { $regex: /^http/ }, // Find a product with a valid image URL
  }).lean()) as Product | null;

  return alternativeProduct || product;
});

const PAGE_SIZE = 50;

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
    category,
    sort,
    price,
    rating,
    page = "1",
    materialType,
  }: {
    q: string;
    productCategory: string;
    category: string;
    price: string;
    rating: string;
    sort: string;
    page: string;
    materialType: string;
  }) => {
    console.log("price", price);
    // ----------------------------------------
    // ✅ Connect to MongoDB
    // ----------------------------------------
    await dbConnect();

    // ----------------------------------------
    // ✅ Get All Unique Product Categories
    // Used for dropdown population or default filters
    // ----------------------------------------
    const categories = await ProductModel.find()
      .distinct("productCategory")
      .lean();

    // ----------------------------------------
    // ✅ Full-Text Search Filter (q)
    // If q is not 'all', apply case-insensitive regex on product name
    // ----------------------------------------
    const queryFilter =
      q && q !== "all"
        ? {
            name: {
              $regex: q,
              $options: "i",
            },
          }
        : {};

    // ----------------------------------------
    // ✅ Product Category Filter (dropdown)
    // If not 'all', use specific category; otherwise include all
    // ----------------------------------------
    const categoryFilter =
      productCategory && productCategory !== "all"
        ? {
            productCategory: {
              $in: productCategory.split(","),
            },
          }
        : {
            productCategory: { $in: categories },
          };

    // ----------------------------------------
    // ✅ Dynamic Category/SubCategory Filter
    // Special handling for Pendant categories (minimalist, etc.)
    // ----------------------------------------
    let categoryOnlyFilter = {};

    if (category && category !== "all") {
      // Check if the given category is a subcategory
      const isSubCategory = await ProductModel.exists({
        subCategories: category,
      });

      if (isSubCategory) {
        categoryOnlyFilter = { subCategories: category };
      } else {
        categoryOnlyFilter = { category };
      }
    }

    // ----------------------------------------
    // ✅ Rating Filter (≥ selected rating)
    // ----------------------------------------
    const ratingFilter =
      rating && rating !== "all"
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};

    // ----------------------------------------
    // ✅ Price Filter (single price or range)
    // Supports "min-max" format or exact number
    // ----------------------------------------
    // const priceFilter =
    //   price && price !== "all"
    //     ? price.includes("-")
    //       ? {
    //           price: {
    //             $gte: parseFloat(price.split("-")[0]),
    //             $lte: parseFloat(price.split("-")[1]),
    //           },
    //         }
    //       : {
    //           price: parseFloat(price),
    //         }
    //     : {};
    const decodedPrice = price;

    const priceFilter =
      decodedPrice && decodedPrice !== "all"
        ? decodedPrice.includes("-")
          ? {
              price: {
                $gte: parseFloat(decodedPrice.split("-")[0]),
                $lte: parseFloat(decodedPrice.split("-")[1]),
              },
            }
          : decodedPrice.includes("+")
            ? {
                price: {
                  $gte: parseFloat(decodedPrice.replace("+", "")),
                },
              }
            : {
                price: parseFloat(decodedPrice),
              }
        : {};

    console.log("🧮 Price filter:", decodedPrice, priceFilter);

    // ----------------------------------------
    // ✅ Material Type Filter (e.g., gold, diamond, silver)
    // If not 'all', filters only matching materialType
    // ----------------------------------------
    // ✅ Material Type Filter (e.g., gold, diamond, silver)
    const materialTypeFilter =
      materialType && materialType !== "all"
        ? {
            materialType: {
              $in: materialType
                .split(",")
                .map((m) => new RegExp(`^${m}$`, "i")),
            },
          }
        : {};

    // ----------------------------------------
    // ✅ Sort Logic
    // lowest → price ascending
    // highest → price descending
    // toprated → rating descending
    // default → latest (_id descending)
    // ----------------------------------------
    const order: Record<string, 1 | -1> =
      sort === "lowest"
        ? { price: 1 }
        : sort === "highest"
          ? { price: -1 }
          : sort === "toprated"
            ? { rating: -1 }
            : { _id: -1 };

    // ----------------------------------------
    // ✅ MongoDB Aggregation to Filter & Sort Products
    // Also prioritize items with valid image URLs
    // ----------------------------------------
    let products = await ProductModel.aggregate([
      {
        $match: {
          ...queryFilter,
          ...categoryFilter,
          ...categoryOnlyFilter,
          ...priceFilter,
          ...ratingFilter,
          ...materialTypeFilter,
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
      { $sort: { hasValidImage: -1, ...order } },
      { $project: { reviews: 0, hasValidImage: 0 } },
    ]);

    // ----------------------------------------
    // ✅ Total Product Count After Filtering
    // ----------------------------------------
    const countProducts = products.length;

    // ----------------------------------------
    // ✅ Category-based Interleaving or Shuffling
    // If multiple categories → interleave
    // Else → random shuffle
    // ----------------------------------------
    const uniqueCategories = new Set(products.map((p) => p.productCategory));
    if (uniqueCategories.size > 1) {
      const categoryMap = groupByCategory(products);
      products = interleaveCategoriesStrict(categoryMap);
    } else {
      products = shuffleArray(products);
    }

    // ----------------------------------------
    // ✅ Pagination
    // Default PAGE_SIZE is assumed to be defined globally
    // ----------------------------------------
    const paginatedProducts = products.slice(
      PAGE_SIZE * (Number(page) - 1),
      PAGE_SIZE * Number(page)
    );

    // ----------------------------------------
    // ✅ Return Results
    // Products, count, pagination info, categories for dropdowns
    // ----------------------------------------
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

const getMaterialTypes = cache(async () => {
  await dbConnect();

  // Fetch distinct categories
  const categories = await ProductModel.find().distinct("materialType");

  // Fetch categories that have at least one product with an image URL
  const categoriesWithImages = await ProductModel.aggregate([
    {
      $match: { image: { $regex: /^http/ } }, // Find products with valid image URLs
    },
    {
      $group: { _id: "$materialType" }, // Group by category
    },
  ]);

  // Create a Set for quick lookup
  const categoriesWithImagesSet = new Set(
    categoriesWithImages.map((c) => c._id)
  );

  // Sort: Categories with images come first
  const sortedMaterialTypes = categories.sort((a, b) => {
    const hasImageA = categoriesWithImagesSet.has(a);
    const hasImageB = categoriesWithImagesSet.has(b);

    return Number(hasImageB) - Number(hasImageA); // Convert boolean to number (true → 1, false → 0)
  });

  return sortedMaterialTypes;
});

const getByCategory = cache(async (category: string) => {
  await dbConnect();

  console.log(`🔹 Fetching products for category: ${category}`);

  const products = await ProductModel.find({
    productCategory: category,
  }).lean();

  console.log(
    `✅ Fetched ${products.length} products for category: ${category}`
  );

  if (!products || products.length === 0) {
    console.warn(`⚠️ No products found for category: ${category}`);
    return [];
  }

  // Filter: Keep only products with a valid image URL
  const validProducts = products.filter(
    (product) => product.image && /^https?:\/\//.test(product.image)
  );

  // If no products have valid images, return all products
  const productsToShuffle = validProducts.length > 0 ? validProducts : products;

  // Shuffle the filtered products
  const shuffledProducts = shuffleArray(productsToShuffle);

  return shuffledProducts as unknown as Product[];
});

const getCombinedCategoriesAndSubcategories = cache(async () => {
  await dbConnect();

  const categories = await ProductModel.distinct("category", {
    image: { $regex: /^http/ },
  });

  const subcategories = await ProductModel.distinct("subCategories", {
    image: { $regex: /^http/ },
  });

  // Combine and filter out bad values
  const combined = Array.from(
    new Set([...categories, ...subcategories])
  ).filter(
    (item) =>
      item &&
      typeof item === "string" &&
      item.trim().toLowerCase() !== "na" &&
      item.trim().toLowerCase() !== "n/a" &&
      item.trim().toLowerCase() !== "null"
  );

  return combined;
});

const productService = {
  getLatest,
  getFeatured,
  getBySlug,
  getByQuery,
  getCategories,
  getTopRated,
  getByCategory,
  getMaterialTypes,
  getByProductCode,
  getCombinedCategoriesAndSubcategories,
};

export default productService;
