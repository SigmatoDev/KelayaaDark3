import Link from "next/link";
import ProductItem from "@/components/products/ProductItem";
import { Rating } from "@/components/products/Rating";
import productServices from "@/lib/services/productService";
import CategoryDropdown from "./dropDownCategories";
import PriceFilter from "./priceFilter";
import RatingFilter from "./ratingFilter";

const sortOrders = ["newest", "lowest", "highest", "rating"];

export async function generateMetadata({
  searchParams: {
    q = "all",
    productCategory = "all",
    price = "all",
    rating = "all",
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
  if (
    (q !== "all" && q !== "") ||
    productCategory !== "all" ||
    rating !== "all" ||
    price !== "all"
  ) {
    return {
      title: `Search ${q !== "all" ? q : ""}
          ${productCategory !== "all" ? ` : ProductCategory ${productCategory}` : ""}
          ${price !== "all" ? ` : Price ${price}` : ""}
          ${rating !== "all" ? ` : Rating ${rating}` : ""}`,
    };
  } else {
    return {
      title: "Search Products",
    };
  }
}

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
    const params = { q, productCategory, price, rating, sort, page };
    if (c) params.productCategory = c;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;
    if (s) params.sort = s;
    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const categories = await productServices.getCategories();
  const { countProducts, products, pages } = await productServices.getByQuery({
    productCategory,
    q,
    price,
    rating,
    page,
    sort,
  });

  return (
    <div className="grid md:grid-cols-5 gap-6 p-6 ">
      {/* Filters Section */}
      <div className="space-y-6">
        {/* Categories */}
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
        {/* Prices */}
        <PriceFilter
          selectedPrice={price}
          q={q}
          productCategory={productCategory}
          rating={rating}
          sort={sort}
          page={page}
        />
        {/* Ratings */}
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
              {products.length === 0 ? "No" : countProducts} Results
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
                    ? "bg-pink-100 text-pink-500 "
                    : "hover:bg-pink-100 text-pink-500"
                }`}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductItem key={product.slug} product={product} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          {Array.from(Array(pages).keys()).map((p) => (
            <Link
              key={p}
              href={getFilterUrl({ pg: `${p + 1}` })}
              className={`px-4 py-2 mx-1 rounded-md ${
                Number(page) === p + 1
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-100 text-blue-500"
              }`}
            >
              {p + 1}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
