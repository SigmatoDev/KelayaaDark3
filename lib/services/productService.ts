import { cache } from "react";

import dbConnect from "@/lib/dbConnect";
import ProductModel, { Product } from "@/lib/models/ProductModel";
import SetsProductModel from "../models/SetsProductsModel";
import GoldDiamondProductPricingModel from "../models/GoldDiamondProductsPricingDetails";
import BanglesProductModel from "../models/BanglesProductSchema";

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

  // ✅ 3. Fetch Gold Sets from SetsProductModel
  const goldSetProducts = await SetsProductModel.find({
    productType: { $regex: /^sets$/i },
    materialType: { $regex: /^gold$/i },
  })
    .sort({ _id: -1 }) // Latest first
    .lean();

  // ✅ 4. Fetch Gold Bangles from BanglesProductModel
  const goldBanglesProducts = await BanglesProductModel.find({
    productType: { $regex: /^bangles$/i },
    materialType: { $regex: /^gold$/i },
  })
    .sort({ _id: -1 }) // Latest first
    .lean();

  // ✅ 5. Combine All Product Types (Regular, Gold Sets, Gold Bangles)
  const combinedProducts = [
    ...regularProducts,
    ...goldSetProducts,
    ...goldBanglesProducts,
  ];

  console.log("combinedProducts", combinedProducts.length);

  // ✅ 6. Shuffle the Products
  const shuffledProducts = shuffleArray(combinedProducts);

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

    // ✅ 2. If not found in ProductModel, check SetsProductModel (only gold sets)
    if (!product) {
      product = (await SetsProductModel.findOne({
        productCode,
        productType: { $regex: /^sets$/i },
        materialType: { $regex: /^gold$/i },
      }).lean()) as Product | null;

      if (product) return product; // Sets don't need pricing merge
    }

    // ✅ 3. If not found in SetsProductModel, check BanglesModel (only gold bangles)
    if (!product) {
      product = (await BanglesProductModel.findOne({
        productCode,
        productType: { $regex: /^bangles$/i },
        materialType: { $regex: /^gold$/i },
      }).lean()) as Product | null;
    }

    // ✅ 4. If product is gold and not a set, merge pricing info
    const isGold = product?.materialType === "gold";
    const isSet = product?.productType?.toLowerCase() === "sets";

    if (product && isGold && !isSet) {
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
    categoryMap.set(category, products);
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

// const getByQuery = cache(
//   async ({
//     q,
//     productCategory,
//     category,
//     sort,
//     price,
//     rating,
//     page = "1",
//     materialType,
//     collectionType,
//   }: {
//     q: string;
//     productCategory: string;
//     category: string;
//     price: string;
//     rating: string;
//     sort: string;
//     page: string;
//     materialType: string;
//     collectionType: string;
//   }) => {
//     console.log("🟡 [Input Price]:", price);

//     await dbConnect();

//     const categories = await ProductModel.find()
//       .distinct("productCategory")
//       .lean();

//     const queryFilter =
//       q && q !== "all" ? { name: { $regex: q, $options: "i" } } : {};

//     const categoryFilter =
//       productCategory && productCategory !== "all"
//         ? { productCategory: { $in: productCategory.split(",") } }
//         : { productCategory: { $in: categories } };

//     let categoryOnlyFilter = {};

//     if (category && category !== "all") {
//       const isGold =
//         materialType && materialType.toLowerCase().includes("gold");

//       const isSilver =
//         materialType && materialType.toLowerCase().includes("silver");

//       if (isGold) {
//         const isSubCategory = await ProductModel.exists({
//           subCategories: { $regex: new RegExp(`^${category}$`, "i") },
//         });

//         categoryOnlyFilter = isSubCategory
//           ? { subCategories: { $regex: new RegExp(`^${category}$`, "i") } }
//           : { category: { $regex: new RegExp(`^${category}$`, "i") } };
//       } else if (isSilver) {
//         categoryOnlyFilter = {
//           category: { $regex: new RegExp(`^${category}$`, "i") },
//         };
//       } else {
//         const isSubCategory = await ProductModel.exists({
//           subCategories: { $regex: new RegExp(`^${category}$`, "i") },
//         });

//         categoryOnlyFilter = isSubCategory
//           ? { subCategories: { $regex: new RegExp(`^${category}$`, "i") } }
//           : { category: { $regex: new RegExp(`^${category}$`, "i") } };
//       }
//     }

//     const ratingFilter =
//       rating && rating !== "all" ? { rating: { $gte: Number(rating) } } : {};

//     const decodedPrice = price;
//     const priceFilter =
//       decodedPrice && decodedPrice !== "all"
//         ? decodedPrice.includes("-")
//           ? {
//               price: {
//                 $gte: parseFloat(decodedPrice.split("-")[0]),
//                 $lte: parseFloat(decodedPrice.split("-")[1]),
//               },
//             }
//           : decodedPrice.includes("+")
//             ? {
//                 price: {
//                   $gte: parseFloat(decodedPrice.replace("+", "")),
//                 },
//               }
//             : {
//                 price: parseFloat(decodedPrice),
//               }
//         : {};

//     const materialTypeFilter =
//       materialType && materialType !== "all"
//         ? {
//             materialType: {
//               $in: materialType
//                 .split(",")
//                 .map((m) => new RegExp(`^${m}$`, "i")),
//             },
//           }
//         : {};

//     const collectionTypeFilter =
//       collectionType && collectionType !== "all"
//         ? {
//             collectionType: {
//               $regex: new RegExp(`^${collectionType}$`, "i"),
//             },
//           }
//         : {};

//     const order: Record<string, 1 | -1> =
//       sort === "lowest"
//         ? { price: 1 }
//         : sort === "highest"
//           ? { price: -1 }
//           : sort === "toprated"
//             ? { rating: -1 }
//             : { _id: -1 };

//     // ✅ Special case for "collections"
//     if (productCategory?.toLowerCase() === "collections") {
//       const collectionQuery: any = {
//         collectionType: { $exists: true, $ne: null },
//       };

//       if (collectionType && collectionType !== "all") {
//         collectionQuery.collectionType = {
//           $regex: new RegExp(`^${collectionType}$`, "i"),
//         };
//       }

//       if (q && q !== "all") {
//         collectionQuery.name = { $regex: q, $options: "i" };
//       }

//       if (rating && rating !== "all") {
//         collectionQuery.rating = { $gte: Number(rating) };
//       }

//       if (decodedPrice && decodedPrice !== "all") {
//         if (decodedPrice.includes("-")) {
//           collectionQuery.price = {
//             $gte: parseFloat(decodedPrice.split("-")[0]),
//             $lte: parseFloat(decodedPrice.split("-")[1]),
//           };
//         } else if (decodedPrice.includes("+")) {
//           collectionQuery.price = {
//             $gte: parseFloat(decodedPrice.replace("+", "")),
//           };
//         } else {
//           collectionQuery.price = parseFloat(decodedPrice);
//         }
//       }

//       const products = await ProductModel.find(collectionQuery)
//         .sort(order)
//         .lean();

//       const countProducts = products.length;

//       const paginatedProducts = products.slice(
//         PAGE_SIZE * (Number(page) - 1),
//         PAGE_SIZE * Number(page)
//       );

//       return {
//         products: paginatedProducts as unknown as Product[],
//         countProducts,
//         page,
//         pages: Math.ceil(countProducts / PAGE_SIZE),
//         categories,
//       };
//     }

//     // ✅ Default product fetch (no image filtering)
//     let products = await ProductModel.aggregate([
//       {
//         $match: {
//           ...queryFilter,
//           ...categoryFilter,
//           ...categoryOnlyFilter,
//           ...priceFilter,
//           ...ratingFilter,
//           ...materialTypeFilter,
//           ...collectionTypeFilter,
//         },
//       },
//     ]);

//     // ✅ Optionally add gold sets
//     const shouldAddGoldSets =
//       productCategory?.toLowerCase() === "sets" &&
//       materialType?.toLowerCase().includes("gold");

//     const isDefaultSearch =
//       (!productCategory || productCategory === "all") &&
//       (!category || category === "all") &&
//       (!materialType || materialType === "all") &&
//       (!price || price === "all") &&
//       (!rating || rating === "all") &&
//       (!q || q === "all");

//     if (shouldAddGoldSets || isDefaultSearch) {
//       const setQuery: any = {
//         materialType: /gold/i,
//         productType: /sets/i,
//       };

//       if (collectionType && collectionType !== "all") {
//         setQuery.collectionType = new RegExp(`^${collectionType}$`, "i");
//       }

//       if (category && category !== "all") {
//         setQuery.subCategories = category;
//       }

//       if (q && q !== "all") {
//         setQuery.name = { $regex: q, $options: "i" };
//       }

//       if (rating && rating !== "all") {
//         setQuery.rating = { $gte: Number(rating) };
//       }

//       if (decodedPrice && decodedPrice !== "all") {
//         if (decodedPrice.includes("-")) {
//           setQuery["price"] = {
//             $gte: parseFloat(decodedPrice.split("-")[0]),
//             $lte: parseFloat(decodedPrice.split("-")[1]),
//           };
//         } else if (decodedPrice.includes("+")) {
//           setQuery["price"] = {
//             $gte: parseFloat(decodedPrice.replace("+", "")),
//           };
//         } else {
//           setQuery["price"] = parseFloat(decodedPrice);
//         }
//       }

//       const setProducts = await SetsProductModel.find(setQuery)
//         .sort(order)
//         .lean();
//       products = [...products, ...setProducts];
//     }

//     const countProducts = products.length;

//     const uniqueCategories = new Set(products.map((p) => p.productCategory));
//     if (uniqueCategories.size > 1) {
//       const categoryMap = groupByCategory(products);
//       products = interleaveCategoriesStrict(categoryMap);
//     }

//     const paginatedProducts = products.slice(
//       PAGE_SIZE * (Number(page) - 1),
//       PAGE_SIZE * Number(page)
//     );

//     return {
//       products: paginatedProducts as Product[],
//       countProducts,
//       page,
//       pages: Math.ceil(countProducts / PAGE_SIZE),
//       categories,
//     };
//   }
// );

// const getCategories = cache(async () => {
//   await dbConnect();
//   const categories = await ProductModel.find().distinct("productCategory");
//   return categories;
// });

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
    collectionType,
  }: {
    q: string;
    productCategory: string;
    category: string;
    price: string;
    rating: string;
    sort: string;
    page: string;
    materialType: string;
    collectionType: string;
  }) => {
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

      if (isGold || isSilver) {
        const isSubCategory = await ProductModel.exists({
          subCategories: { $regex: new RegExp(`^${category}$`, "i") },
        });

        categoryOnlyFilter = isSubCategory
          ? { subCategories: { $regex: new RegExp(`^${category}$`, "i") } }
          : { category: { $regex: new RegExp(`^${category}$`, "i") } };
      }
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

    const collectionTypeFilter =
      collectionType && collectionType !== "all"
        ? {
            collectionType: {
              $in: collectionType
                .split(",")
                .map((ct) => new RegExp(`^${ct}$`, "i")),
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

    // Handle collection-specific search
    if (productCategory?.toLowerCase() === "collections") {
      const collectionQuery: any = {
        collectionType: { $exists: true, $ne: null },
      };

      if (collectionType && collectionType !== "all") {
        collectionQuery.collectionType = {
          $in: collectionType
            .split(",")
            .map((ct) => new RegExp(`^${ct}$`, "i")),
        };
      }

      if (q && q !== "all") {
        collectionQuery.name = { $regex: q, $options: "i" };
      }

      if (rating && rating !== "all") {
        collectionQuery.rating = { $gte: Number(rating) };
      }

      if (decodedPrice && decodedPrice !== "all") {
        if (decodedPrice.includes("-")) {
          collectionQuery.price = {
            $gte: parseFloat(decodedPrice.split("-")[0]),
            $lte: parseFloat(decodedPrice.split("-")[1]),
          };
        } else if (decodedPrice.includes("+")) {
          collectionQuery.price = {
            $gte: parseFloat(decodedPrice.replace("+", "")),
          };
        } else {
          collectionQuery.price = parseFloat(decodedPrice);
        }
      }

      let products = await ProductModel.find(collectionQuery)
        .sort(order)
        .lean();

      products = products.filter(
        (p) =>
          typeof p.price === "number" &&
          p.price > 0 &&
          typeof p.name === "string" &&
          p.name.trim() !== "" &&
          typeof p.productCode === "string" &&
          p.productCode.trim() !== ""
      );

      const countProducts = products.length;

      const paginatedProducts = products.slice(
        PAGE_SIZE * (Number(page) - 1),
        PAGE_SIZE * Number(page)
      );

      return {
        products: paginatedProducts as unknown as Product[],
        countProducts,
        page,
        pages: Math.ceil(countProducts / PAGE_SIZE),
        categories,
      };
    }

    // Main query from ProductModel
    let products = await ProductModel.aggregate([
      {
        $match: {
          ...queryFilter,
          ...categoryFilter,
          ...categoryOnlyFilter,
          ...priceFilter,
          ...ratingFilter,
          ...materialTypeFilter,
          ...collectionTypeFilter,
        },
      },
    ]);

    const shouldAddGoldSets =
      productCategory?.toLowerCase() === "sets" &&
      materialType?.toLowerCase().includes("gold");

    const shouldAddGoldBangles =
      productCategory?.toLowerCase() === "bangles" &&
      materialType?.toLowerCase().includes("gold");

    const shouldAddGoldBanglePairs =
      productCategory?.toLowerCase() === "bangle pair" &&
      materialType?.toLowerCase().includes("gold");

    const isDefaultSearch =
      (!productCategory || productCategory === "all") &&
      (!category || category === "all") &&
      (!materialType || materialType === "all") &&
      (!price || price === "all") &&
      (!rating || rating === "all") &&
      (!q || q === "all");

    // Debugging the shouldAddGoldBanglePairs condition
    console.log("Should Add Gold Bangle Pairs:", shouldAddGoldBanglePairs);
    console.log("Is Default Search:", isDefaultSearch);

    if (shouldAddGoldSets || isDefaultSearch) {
      const setQuery: any = {
        materialType: /gold/i,
        productType: /sets/i,
      };

      if (collectionType && collectionType !== "all") {
        setQuery.collectionType = {
          $in: collectionType
            .split(",")
            .map((ct) => new RegExp(`^${ct}$`, "i")),
        };
      }

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
          setQuery.price = {
            $gte: parseFloat(decodedPrice.split("-")[0]),
            $lte: parseFloat(decodedPrice.split("-")[1]),
          };
        } else if (decodedPrice.includes("+")) {
          setQuery.price = {
            $gte: parseFloat(decodedPrice.replace("+", "")),
          };
        } else {
          setQuery.price = parseFloat(decodedPrice);
        }
      }

      const setProducts = await SetsProductModel.find(setQuery)
        .sort(order)
        .lean();

      products = [...products, ...setProducts];
    }

    if (shouldAddGoldBangles || isDefaultSearch) {
      const banglesQuery: any = {
        materialType: /gold/i,
        productType: /bangles/i, // Ensure it only targets regular bangles
      };

      if (collectionType && collectionType !== "all") {
        banglesQuery.collectionType = {
          $in: collectionType
            .split(",")
            .map((ct) => new RegExp(`^${ct}$`, "i")),
        };
      }

      if (category && category !== "all") {
        banglesQuery.subCategories = {
          $regex: new RegExp(`^${category}$`, "i"),
        };
      }

      if (q && q !== "all") {
        banglesQuery.name = { $regex: q, $options: "i" };
      }

      if (rating && rating !== "all") {
        banglesQuery.rating = { $gte: Number(rating) };
      }

      if (decodedPrice && decodedPrice !== "all") {
        if (decodedPrice.includes("-")) {
          banglesQuery.price = {
            $gte: parseFloat(decodedPrice.split("-")[0]),
            $lte: parseFloat(decodedPrice.split("-")[1]),
          };
        } else if (decodedPrice.includes("+")) {
          banglesQuery.price = {
            $gte: parseFloat(decodedPrice.replace("+", "")),
          };
        } else {
          banglesQuery.price = parseFloat(decodedPrice);
        }
      }

      const banglesProducts = await BanglesProductModel.find(banglesQuery)
        .sort(order)
        .lean();

      console.log("Bangles Products:", banglesProducts); // Debugging

      products = [...products, ...banglesProducts];
    }

    // Adding the "Bangle Pair" filtering logic
    if (shouldAddGoldBanglePairs || isDefaultSearch) {
      const banglePairQuery: any = {
        materialType: /gold/i,
        productType: /bangle pair/i, // Ensure it only targets bangle pair products
      };

      if (collectionType && collectionType !== "all") {
        banglePairQuery.collectionType = {
          $in: collectionType
            .split(",")
            .map((ct) => new RegExp(`^${ct}$`, "i")),
        };
      }

      if (category && category !== "all") {
        banglePairQuery.subCategories = {
          $regex: new RegExp(`^${category}$`, "i"),
        };
      }

      if (q && q !== "all") {
        banglePairQuery.name = { $regex: q, $options: "i" };
      }

      if (rating && rating !== "all") {
        banglePairQuery.rating = { $gte: Number(rating) };
      }

      if (decodedPrice && decodedPrice !== "all") {
        if (decodedPrice.includes("-")) {
          banglePairQuery.price = {
            $gte: parseFloat(decodedPrice.split("-")[0]),
            $lte: parseFloat(decodedPrice.split("-")[1]),
          };
        } else if (decodedPrice.includes("+")) {
          banglePairQuery.price = {
            $gte: parseFloat(decodedPrice.replace("+", "")),
          };
        } else {
          banglePairQuery.price = parseFloat(decodedPrice);
        }
      }

      const banglePairProducts = await BanglesProductModel.find(banglePairQuery)
        .sort(order)
        .lean();

      products = [...products, ...banglePairProducts];
    }

    const countProducts = products.length;

    const paginatedProducts = products.slice(
      PAGE_SIZE * (Number(page) - 1),
      PAGE_SIZE * Number(page)
    );

    return {
      products: paginatedProducts as unknown as Product[],
      countProducts,
      page,
      pages: Math.ceil(countProducts / PAGE_SIZE),
      categories,
    };
  }
);

const getCategories = cache(async () => {
  await dbConnect();

  // Fetch distinct categories from all models
  const productCategories =
    await ProductModel.find().distinct("productCategory");
  const setsCategories = await SetsProductModel.find().distinct("productType");
  const banglesCategories =
    await BanglesProductModel.find().distinct("productType");

  // Combine and deduplicate
  const allCategories = Array.from(
    new Set([...productCategories, ...setsCategories, ...banglesCategories])
  );

  // Sort alphabetically
  const sortedCategories = allCategories.sort((a, b) => a.localeCompare(b));
  console.log("sortedCategories", sortedCategories);
  return sortedCategories;
});

const getMaterialTypes = cache(async () => {
  await dbConnect();

  // Fetch distinct material types from all models
  const productMaterialTypes =
    await ProductModel.find().distinct("materialType");
  const setsMaterialTypes =
    await SetsProductModel.find().distinct("materialType");
  const banglesMaterialTypes =
    await BanglesProductModel.find().distinct("materialType");

  // Combine and deduplicate
  const allMaterialTypes = Array.from(
    new Set([
      ...productMaterialTypes,
      ...setsMaterialTypes,
      ...banglesMaterialTypes,
    ])
  );

  // Sort alphabetically
  const sortedMaterialTypes = allMaterialTypes.sort((a, b) =>
    a.localeCompare(b)
  );

  return sortedMaterialTypes;
});

const getByCategory = cache(async (category: string) => {
  await dbConnect();

  console.log(`🔹 Fetching products for category: ${category}`);

  const productQuery: Record<string, any> = { productCategory: category };
  const setsQuery: Record<string, any> = { productType: category };
  const banglesQuery: Record<string, any> = { productType: category };

  // Fetch products from ProductModel, SetsProductModel, and BanglesProductModel
  const products = await Promise.all([
    ProductModel.find(productQuery).lean(),
    SetsProductModel.find(setsQuery).lean(),
    BanglesProductModel.find(banglesQuery).lean(),
  ]);

  // Combine all products
  const allProducts = [...products[0], ...products[1], ...products[2]];

  console.log(
    `✅ Fetched ${allProducts.length} products for category: ${category}`
  );

  if (!allProducts || allProducts.length === 0) {
    console.warn(`⚠️ No products found for category: ${category}`);
    return [];
  }

  // Return all products without filtering based on image validation
  return allProducts as unknown as Product[];
});

const getCombinedCategoriesAndSubcategories = cache(async () => {
  await dbConnect();

  // ✅ From ProductModel
  const categories = await ProductModel.distinct("category");

  const subcategoriesFromProducts =
    await ProductModel.distinct("subCategories");

  // ✅ From SetsProductModel
  const subcategoriesFromSets =
    await SetsProductModel.distinct("subCategories");

  // ✅ From BanglesProductModel
  const subcategoriesFromBangles =
    await BanglesProductModel.distinct("subCategories");

  // ✅ Combine and flatten all subcategories
  const allSubcategories = [
    ...subcategoriesFromProducts,
    ...subcategoriesFromSets,
    ...subcategoriesFromBangles,
  ].flat();

  // ✅ Combine all and filter out invalid values
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

const getCombinedByProductCategory = cache(
  async (productCategory: string, materialType?: string) => {
    await dbConnect();
    const regexCategory = new RegExp(`^${productCategory}$`, "i");

    console.log(
      "🔍 Fetching combined categories/subcategories for:",
      productCategory,
      materialType
        ? `with materialType: ${materialType}`
        : "without materialType"
    );

    // Build query for product category and material type (if provided)
    const productQuery: Record<string, any> = {
      productCategory: regexCategory,
    };
    if (materialType && materialType !== "all") {
      productQuery.materialType = materialType;
    }

    // Fetch categories from ProductModel
    const categories = await ProductModel.distinct("category", productQuery);
    console.log("📦 Categories from ProductModel:", categories);

    // Fetch subcategories from ProductModel
    const subcategoriesFromProducts = await ProductModel.distinct(
      "subCategories",
      productQuery
    );
    console.log(
      "🧩 Subcategories from ProductModel:",
      subcategoriesFromProducts
    );

    // Fetch subcategories from SetsProductModel
    const setsQuery: Record<string, any> = { productType: regexCategory };
    if (materialType && materialType !== "all") {
      setsQuery.materialType = materialType;
    }

    const subcategoriesFromSets = await SetsProductModel.distinct(
      "subCategories",
      setsQuery
    );
    console.log(
      "🎁 Subcategories from SetsProductModel:",
      subcategoriesFromSets
    );

    // Fetch subcategories from BanglesProductModel
    const banglesQuery: Record<string, any> = { productType: regexCategory };
    if (materialType && materialType !== "all") {
      banglesQuery.materialType = materialType;
    }

    const subcategoriesFromBangles = await BanglesProductModel.distinct(
      "subCategories",
      banglesQuery
    );
    console.log(
      "🪙 Subcategories from BanglesProductModel:",
      subcategoriesFromBangles
    );

    // Combine and flatten subcategories from all models
    const allSubcategories = [
      ...subcategoriesFromProducts,
      ...subcategoriesFromSets,
      ...subcategoriesFromBangles,
    ].flat();
    console.log("🧮 Combined raw subcategories:", allSubcategories);

    // Combine categories and subcategories
    const rawCombined = [...categories, ...allSubcategories];

    // Use a Map to deduplicate and normalize case
    const normalizedMap = new Map<string, string>();
    for (const item of rawCombined) {
      if (
        item &&
        typeof item === "string" &&
        !["na", "n/a", "null"].includes(item.trim().toLowerCase())
      ) {
        const key = item.trim().toLowerCase();
        if (!normalizedMap.has(key)) {
          normalizedMap.set(key, item.trim());
        }
      }
    }

    const combined = Array.from(normalizedMap.values());
    console.log("✅ Final deduplicated categories/subcategories:", combined);

    return combined;
  }
);

// similar products
const getSimilarProducts = cache(
  async (
    productCategory: string,
    category?: string,
    subCategories?: string[] | string,
    materialType?: string,
    currentProductCode?: string
  ) => {
    await dbConnect();

    console.log(
      `🔍 Querying for products with productCategory: "${productCategory}"`
    );

    // Normalize subCategories into an array
    let normalizedSubCategories: string[] = [];
    if (Array.isArray(subCategories)) {
      normalizedSubCategories = subCategories;
    } else if (typeof subCategories === "string") {
      const lower = subCategories.trim().toLowerCase();
      if (
        lower !== "na" &&
        lower !== "n/a" &&
        lower !== "null" &&
        lower !== ""
      ) {
        normalizedSubCategories = [subCategories];
      }
    }

    const regexCategory = new RegExp(`^${productCategory}$`, "i");
    const regexMaterialType = materialType
      ? new RegExp(`^${materialType}$`, "i")
      : null;
    const regexMainCategory = category
      ? new RegExp(`^${category}$`, "i")
      : null;
    const regexSubCategories = normalizedSubCategories.map(
      (sub) => new RegExp(`^${sub}$`, "i")
    );

    let productIdToExclude: any = null;
    if (currentProductCode) {
      const currentProduct = await ProductModel.findOne({
        productCode: currentProductCode,
      }).select("_id");

      if (currentProduct?._id) {
        productIdToExclude = currentProduct._id;
      }
    }

    // 🌟 MAIN FILTER (strict matching)
    const baseFilter: any[] = [
      { productCategory: regexCategory },
      productIdToExclude ? { _id: { $ne: productIdToExclude } } : {},
    ];
    if (regexMainCategory) baseFilter.push({ category: regexMainCategory });
    if (regexSubCategories.length > 0)
      baseFilter.push({ subCategories: { $in: regexSubCategories } });
    if (regexMaterialType) baseFilter.push({ materialType: regexMaterialType });

    const fullFilter = { $and: baseFilter };
    console.log(
      "🧠 Initial MongoDB Filter:",
      JSON.stringify(fullFilter, null, 2)
    );

    // Fetch from all 3 models
    const [regularProducts, setsProducts, banglesProducts] = await Promise.all([
      ProductModel.find(fullFilter).sort({ createdAt: -1 }).lean(),
      SetsProductModel.find({
        productType: regexCategory,
        ...(regexMainCategory && { category: regexMainCategory }),
        ...(regexSubCategories.length > 0 && {
          subCategories: { $in: regexSubCategories },
        }),
        ...(regexMaterialType && { materialType: regexMaterialType }),
        ...(productIdToExclude && { _id: { $ne: productIdToExclude } }),
      })
        .sort({ createdAt: -1 })
        .lean(),
      BanglesProductModel.find({
        productType: regexCategory,
        ...(regexMainCategory && { category: regexMainCategory }),
        ...(regexSubCategories.length > 0 && {
          subCategories: { $in: regexSubCategories },
        }),
        ...(regexMaterialType && { materialType: regexMaterialType }),
        ...(productIdToExclude && { _id: { $ne: productIdToExclude } }),
      })
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const combined = [
      ...regularProducts,
      ...setsProducts,
      ...banglesProducts,
    ].slice(0, 8);

    console.log(`✅ Found ${combined.length} similar products.`);

    // 🆘 FALLBACK if not enough similar products
    if (combined.length < 2 && regexMaterialType) {
      console.log(
        "⚠️ Not enough results — fallback to materialType-only, with mixed categories."
      );

      const materialTypeProducts = await ProductModel.find({
        materialType: regexMaterialType,
        ...(productIdToExclude && { _id: { $ne: productIdToExclude } }),
      })
        .sort({ createdAt: -1 })
        .lean();

      // Group by productCategory
      const groupedByCategory: Record<string, any> = {};
      for (const product of materialTypeProducts) {
        const cat = product.productCategory || "Unknown";
        if (!groupedByCategory[cat]) {
          groupedByCategory[cat] = product;
        }
      }

      return Object.values(groupedByCategory).slice(0, 8);
    }

    return combined;
  }
);

async function getMaterialTypesWithCounts() {
  // Step 1: Aggregate materialType counts from ProductModel
  const productCounts = await ProductModel.aggregate([
    {
      $group: {
        _id: "$materialType",
        count: { $sum: 1 },
      },
    },
  ]);

  // Step 2: Aggregate materialType counts from SetProductModel
  const setProductCounts = await SetsProductModel.aggregate([
    {
      $group: {
        _id: "$materialType",
        count: { $sum: 1 },
      },
    },
  ]);

  // Step 3: Aggregate materialType counts from BanglesProductModel
  const banglesProductCounts = await BanglesProductModel.aggregate([
    {
      $group: {
        _id: "$materialType",
        count: { $sum: 1 },
      },
    },
  ]);

  // Step 4: Combine counts into one object
  const counts: Record<string, number> = {};

  // Add ProductModel counts
  productCounts.forEach((item) => {
    if (item._id) {
      counts[item._id] = (counts[item._id] || 0) + item.count;
    }
  });

  // Add SetProductModel counts
  setProductCounts.forEach((item) => {
    if (item._id) {
      counts[item._id] = (counts[item._id] || 0) + item.count;
    }
  });

  // Add BanglesProductModel counts
  banglesProductCounts.forEach((item) => {
    if (item._id) {
      counts[item._id] = (counts[item._id] || 0) + item.count;
    }
  });

  return counts;
}

async function getDistinctCollectionTypes() {
  const productCollectionTypes = await ProductModel.distinct("collectionType");

  const setProductCollectionTypes =
    await SetsProductModel.distinct("collectionType");

  const banglesProductCollectionTypes =
    await BanglesProductModel.distinct("collectionType");

  const combined = [
    ...productCollectionTypes,
    ...setProductCollectionTypes,
    ...banglesProductCollectionTypes,
  ];

  const unique = Array.from(new Set(combined.filter(Boolean))); // removes null/undefined and duplicates

  return unique;
}

const getCategoriesByCollectionAndMaterialType = cache(
  async (collectionType: string, materialType?: string) => {
    await dbConnect();

    console.log(
      "🔍 Fetching productCategory with collectionType:",
      collectionType,
      "and materialType:",
      materialType
    );

    // 👉 Handle multiple collection types (preserve case)
    const collectionTypes = collectionType
      .split(",")
      .map((ct) => ct.trim())
      .filter((ct) => ct.toLowerCase() !== "all");

    // 👉 Handle multiple material types (preserve case)
    const materialTypes = materialType
      ? materialType
          .split(",")
          .map((mt) => mt.trim())
          .filter((mt) => mt.toLowerCase() !== "all")
      : [];

    const productQuery: Record<string, any> = {};
    const setsQuery: Record<string, any> = {};
    const banglesQuery: Record<string, any> = {};

    if (collectionTypes.length > 0) {
      productQuery.collectionType = { $in: collectionTypes };
      setsQuery.collectionType = { $in: collectionTypes };
      banglesQuery.collectionType = { $in: collectionTypes };
    }

    if (materialTypes.length > 0) {
      productQuery.materialType = { $in: materialTypes };
      setsQuery.materialType = { $in: materialTypes };
      banglesQuery.materialType = { $in: materialTypes };
    }

    // Fetch categories
    const categories = await ProductModel.distinct(
      "productCategory",
      productQuery
    );
    console.log("📦 productCategory from ProductModel:", categories);

    const setsCategories = await SetsProductModel.distinct(
      "productType",
      setsQuery
    );
    console.log("🎁 productCategory from SetsProductModel:", setsCategories);

    const banglesCategories = await BanglesProductModel.distinct(
      "productType",
      banglesQuery
    );
    console.log(
      "🪙 productCategory from BanglesProductModel:",
      banglesCategories
    );

    const allCategories = [
      ...categories,
      ...setsCategories,
      ...banglesCategories,
    ];
    console.log("🧮 Combined raw productCategories:", allCategories);

    // Deduplicate and clean
    const normalizedMap = new Map<string, string>();
    for (const item of allCategories) {
      if (
        item &&
        typeof item === "string" &&
        !["na", "n/a", "null"].includes(item.trim().toLowerCase())
      ) {
        const key = item.trim().toLowerCase();
        if (!normalizedMap.has(key)) {
          normalizedMap.set(key, item.trim());
        }
      }
    }

    const combined = Array.from(normalizedMap.values());
    console.log("✅ Final deduplicated productCategories:", combined);

    return combined;
  }
);

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
  getCombinedByProductCategory,
  getSimilarProducts,
  getMaterialTypesWithCounts,
  getDistinctCollectionTypes,
  getCategoriesByCollectionAndMaterialType,
};

export default productService;
