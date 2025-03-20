import Link from "next/link";
import ProductItem from "@/components/products/ProductItem";
import { Rating } from "@/components/products/Rating";
import productServices from "@/lib/services/productService";
import CategoryDropdown from "./dropDownCategories";
import PriceFilter from "./priceFilter";
import RatingFilter from "./ratingFilter";

const sortOrders = ["newest", "lowest", "highest", "rating"];
const pageSize = 10; // Default to 10 products per page

// Function to validate image URLs
const isValidImageUrl = (url: string) => {
  return url && (url.startsWith("http://") || url.startsWith("https://"));
};

export default async function SearchPage({
  searchParams: {
    q = "all",
    productCategory = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  },
}: {
  searchParams: {
    q: string;
    productCategory: string;
    price: string;
    rating: string;
    sort: string;
    page: string;
  };
}) {
  const currentPage = Number(page);

  // Function to construct filter URLs
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params: any = { q, productCategory, price, rating, sort, page };
    if (c) params.productCategory = c;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;
    if (s) params.sort = s;
    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const categories = await productServices.getCategories();
  console.log("Fetched Categories from API:", categories);

  const shuffleArray = <T,>(array: T[]): T[] => {
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

    // Debug: Print categories before shuffling
    console.log("Categories found before shuffling:", [...categoryMap.keys()]);

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

  // Fetch products
  const { countProducts, products, pages } = await productServices.getByQuery({
    productCategory: "all", // Ensure fetching all categories
    q,
    price,
    rating,
    page: currentPage.toString(),
    sort,
  });

  // Debug: Check if we have multiple categories in the fetched products
  const uniqueCategories = new Set(products.map((p) => p.productCategory));
  console.log("Unique categories found in fetched products:", uniqueCategories);

  let processedProducts = products;

  // Only shuffle when multiple categories are available
  if (uniqueCategories.size > 1) {
    const categoryMap = groupByCategory(products);
    processedProducts = interleaveCategoriesStrict(categoryMap);
  }

  // Filter out products with invalid images
  const validProducts = processedProducts.filter((product) =>
    isValidImageUrl(product.image)
  );

  // Log last 5 products
  console.log(
    "Last 5 processed products:",
    validProducts.slice(-5).map((p) => ({
      name: p.name,
      category: p.productCategory,
    }))
  );

  // Pagination Logic: Show only 3 page numbers at a time
  const startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(pages, startPage + 2);

  return (
    <div className="grid md:grid-cols-5 gap-6 p-6">
      {/* Filters Section */}
      <div className="space-y-6">
        <CategoryDropdown
          categories={categories}
          selectedCategory={productCategory}
          q={q}
          productCategory={productCategory}
          price={price}
          rating={rating}
          sort={sort}
          page={page}
        />
        <PriceFilter
          selectedPrice={price}
          q={q}
          productCategory={productCategory}
          rating={rating}
          sort={sort}
          page={page}
        />
        <RatingFilter
          selectedRating={rating}
          q={q}
          productCategory={productCategory}
          price={price}
          sort={sort}
          page={page}
        />
      </div>

      {/* Results Section */}
      <div className="md:col-span-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-gray-400 font-semibold">
              {validProducts.length === 0 ? "No" : validProducts.length} Results
            </span>
            {q !== "all" && ` : ${q}`}
            {productCategory !== "all" && ` : ${productCategory}`}
            {price !== "all" && ` : Price ${price}`}
            {rating !== "all" && ` : Rating ${rating} & up`}
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-[12px]">Sort by:</span>
            {sortOrders.map((s) => (
              <Link
                key={s}
                href={getFilterUrl({ s })}
                className={`px-3 py-1 text-[12px] rounded-md ${
                  sort === s
                    ? "bg-pink-100 text-pink-500"
                    : "hover:bg-pink-100 text-pink-500"
                }`}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {validProducts.map((product) => (
            <ProductItem key={product.slug} product={product} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center items-center gap-2">
          {/* Previous Button */}
          {currentPage > 1 && (
            <Link
              href={getFilterUrl({ pg: String(currentPage - 1) })}
              className="px-4 py-2 rounded-md border border-pink-500 text-pink-500"
            >
              {"<<"}
            </Link>
          )}

          {/* Page Numbers */}
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => i + startPage
          ).map((p) => (
            <Link
              key={p}
              href={getFilterUrl({ pg: String(p) })}
              className={`px-4 py-2 rounded-md ${
                currentPage === p
                  ? "bg-pink-500 text-white"
                  : "hover:bg-pink-100 text-pink-500"
              }`}
            >
              {p}
            </Link>
          ))}

          {/* Next Button */}
          {currentPage < pages && (
            <Link
              href={getFilterUrl({ pg: String(currentPage + 1) })}
              className="px-4 py-2 rounded-md border border-pink-500 text-pink-500"
            >
              {">>"}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
