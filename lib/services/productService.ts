import { cache } from "react";

import dbConnect from "@/lib/dbConnect";
import ProductModel, { Product } from "@/lib/models/ProductModel";
import SetsProductModel from "../models/SetsProductsModel";
import GoldDiamondProductPricingModel from "../models/GoldDiamondProductsPricingDetails";

export const revalidate = 3600;

// utilitlity
// export const mergeProductWithGoldPricing = async (
//   product: Product
// ): Promise<Product> => {
//   const isGold = product.materialType === "gold";
//   const isSet = product.productType?.toLowerCase() === "sets";

//   if (isGold && !isSet) {
//     const pricing = await GoldPricingModel.findOne({
//       productCode: product.productCode,
//     }).lean();
//     if (pricing) {
//       return {
//         ...product,
//         pricing: {
//           diamondPrice: pricing.diamondPrice,
//           goldPrice: pricing.goldPrice,
//           grossWeight: pricing.grossWeight,
//           pricePerGram: pricing.pricePerGram,
//           makingCharge: pricing.makingCharge,
//           diamondTotal: pricing.diamondTotal,
//           goldTotal: pricing.goldTotal,
//           totalPrice: pricing.totalPrice,
//         },
//       };
//     }
//   }

//   return product;
// };

// return await mergeProductWithGoldPricing(product);

const getLatest = cache(async () => {
  // ✅ 1. Connect to MongoDB
  await dbConnect();

  // ✅ 2. Fetch Latest Products from ProductModel
  const regularProducts = await ProductModel.find({})
    .sort({ _id: -1 }) // Latest first
    .lean();

  // ✅ 3. Fetch Gold Sets from SetProductModel
  const goldSetProducts = await SetsProductModel.find({
    productType: { $regex: /^sets$/i },
    materialType: { $regex: /^gold$/i },
  })
    .sort({ _id: -1 }) // Latest first
    .lean();

  // ✅ 4. Combine Both Product Types
  const combinedProducts = [...regularProducts, ...goldSetProducts];

  console.log("combinedProducts", combinedProducts.length);
  // ✅ 5. Filter Out Invalid Image URLs
  const validProducts = combinedProducts.filter(
    (product) => product.image && /^https?:\/\//.test(product.image)
  );

  // ✅ 6. Shuffle the Products
  const shuffledProducts = shuffleArray(validProducts);

  // ✅ 7. Return Top 8 Latest Products
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

// Pricing Interface
interface GoldDiamondPricing {
  diamondPrice: number;
  goldPrice: number;
  grossWeight: number;
  pricePerGram: number;
  makingCharge: number;
  diamondTotal: number;
  goldTotal: number;
  totalPrice: number;
}

// Extended Product Interface with Optional Pricing
interface ProductWithPricing extends Product {
  pricing?: GoldDiamondPricing;
}

const getByProductCode = cache(
  async (productCode: string): Promise<ProductWithPricing | null> => {
    await dbConnect();

    // ✅ 1. Try to find product in ProductModel
    let product = (await ProductModel.findOne({
      productCode,
    }).lean()) as Product | null;

    // ✅ 2. If found but no valid image, try alternate variant
    if (product && !(product.image && product.image.startsWith("http"))) {
      const alt = (await ProductModel.findOne({
        productCode,
        image: { $regex: /^http/ },
      }).lean()) as Product | null;
      if (alt) product = alt;
    }

    // ✅ 3. If not found in ProductModel, check SetsProductModel (only gold sets)
    if (!product) {
      product = (await SetsProductModel.findOne({
        productCode,
        productType: { $regex: /^sets$/i },
        materialType: { $regex: /^gold$/i },
      }).lean()) as Product | null;

      if (product && !(product.image && /^http/.test(product.image))) {
        const altSet = (await SetsProductModel.findOne({
          productCode,
          image: { $regex: /^http/ },
        }).lean()) as Product | null;

        return altSet || product;
      }

      return product; // Sets don't need pricing merge
    }

    // ✅ 4. If product is gold and not a set, merge pricing info
    const isGold = product.materialType === "gold";
    const isSet = product.productType?.toLowerCase() === "sets";

    if (isGold && !isSet) {
      const pricing = (await GoldDiamondProductPricingModel.findOne({
        productCode,
      }).lean()) as GoldDiamondPricing | null;

      if (pricing) {
        const {
          diamondPrice,
          goldPrice,
          grossWeight,
          pricePerGram,
          makingCharge,
          diamondTotal,
          goldTotal,
          totalPrice,
        } = pricing;

        return {
          ...product,
          pricing: {
            diamondPrice,
            goldPrice,
            grossWeight,
            pricePerGram,
            makingCharge,
            diamondTotal,
            goldTotal,
            totalPrice,
          },
        };
      }
    }

    return product;
  }
);

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
    console.log("🟡 [Input Price]:", price);

    await dbConnect();

    const categories = await ProductModel.find()
      .distinct("productCategory")
      .lean();

    const queryFilter =
      q && q !== "all" ? { name: { $regex: q, $options: "i" } } : {};

    const categoryFilter =
      productCategory && productCategory !== "all"
        ? { productCategory: { $in: productCategory.split(",") } }
        : { productCategory: { $in: categories } };

    let categoryOnlyFilter = {};

    if (category && category !== "all") {
      const isGold =
        materialType && materialType.toLowerCase().includes("gold");

      const isSilver =
        materialType && materialType.toLowerCase().includes("silver");

      // Dynamically determine where to search: subCategories or category
      if (isGold) {
        // For gold, category might be inside subCategories
        const isSubCategory = await ProductModel.exists({
          subCategories: { $regex: new RegExp(`^${category}$`, "i") },
        });

        categoryOnlyFilter = isSubCategory
          ? { subCategories: { $regex: new RegExp(`^${category}$`, "i") } }
          : { category: { $regex: new RegExp(`^${category}$`, "i") } };
      } else if (isSilver) {
        // For silver, search only in the category field
        categoryOnlyFilter = {
          category: { $regex: new RegExp(`^${category}$`, "i") },
        };
      } else {
        // Default fallback if materialType not provided
        const isSubCategory = await ProductModel.exists({
          subCategories: { $regex: new RegExp(`^${category}$`, "i") },
        });

        categoryOnlyFilter = isSubCategory
          ? { subCategories: { $regex: new RegExp(`^${category}$`, "i") } }
          : { category: { $regex: new RegExp(`^${category}$`, "i") } };
      }

      console.log("🔍 [Category Debug]");
      console.log("➡️ Input category:", category);
      console.log("🔩 Material Type:", materialType);
      console.log("📦 categoryOnlyFilter:", categoryOnlyFilter);
    }

    const ratingFilter =
      rating && rating !== "all" ? { rating: { $gte: Number(rating) } } : {};

      
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
    console.log("🧮 [Price Filter]:", decodedPrice, priceFilter);

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

    const order: Record<string, 1 | -1> =
      sort === "lowest"
        ? { price: 1 }
        : sort === "highest"
          ? { price: -1 }
          : sort === "toprated"
            ? { rating: -1 }
            : { _id: -1 };

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

    // ✅ Add Gold Set Products
    const shouldAddGoldSets =
      productCategory?.toLowerCase() === "sets" &&
      materialType?.toLowerCase().includes("gold");

    const isDefaultSearch =
      (!productCategory || productCategory === "all") &&
      (!category || category === "all") &&
      (!materialType || materialType === "all") &&
      (!price || price === "all") &&
      (!rating || rating === "all") &&
      (!q || q === "all");

    if (shouldAddGoldSets || isDefaultSearch) {
      const setQuery: any = {
        materialType: /gold/i,
        productType: /sets/i,
      };

      if (category && category !== "all") {
        setQuery.subCategories = category;
      }

      if (q && q !== "all") {
        setQuery.name = { $regex: q, $options: "i" };
      }

      if (rating && rating !== "all") {
        setQuery.rating = { $gte: Number(rating) };
      }

      if (decodedPrice && decodedPrice !== "all") {
        if (decodedPrice.includes("-")) {
          setQuery["price"] = {
            $gte: parseFloat(decodedPrice.split("-")[0]),
            $lte: parseFloat(decodedPrice.split("-")[1]),
          };
        } else if (decodedPrice.includes("+")) {
          setQuery["price"] = {
            $gte: parseFloat(decodedPrice.replace("+", "")),
          };
        } else {
          setQuery["price"] = parseFloat(decodedPrice);
        }
      }

      const setProducts = await SetsProductModel.find(setQuery)
        .sort(order)
        .lean();
      products = [...products, ...setProducts];
    }

    const countProducts = products.length;

    const uniqueCategories = new Set(products.map((p) => p.productCategory));
    if (uniqueCategories.size > 1) {
      const categoryMap = groupByCategory(products);
      products = interleaveCategoriesStrict(categoryMap);
    } else {
      products = shuffleArray(products);
    }

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

  // From ProductModel
  const categories = await ProductModel.distinct("category", {
    image: { $regex: /^http/ },
  });

  const subcategoriesFromProducts = await ProductModel.distinct(
    "subCategories"
    // {
    //   image: { $regex: /^http/ },
    // }
  );

  // From SetProductModel
  const subcategoriesFromSets = await SetsProductModel.distinct(
    "subCategories"
    // {
    //   image: { $regex: /^http/ },
    // }
  );
  // console.log("subcategoriesFromSets", subcategoriesFromSets);
  // Flatten in case subCategories are stored as arrays
  const allSubcategories = [
    ...subcategoriesFromProducts,
    ...subcategoriesFromSets,
  ].flat();

  // Combine all and filter
  const combined = Array.from(
    new Set([...categories, ...allSubcategories])
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
