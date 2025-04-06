import Link from "next/link";
import ProductItem from "@/components/products/ProductItem";
import { Rating } from "@/components/products/Rating";
import productServices from "@/lib/services/productService";
import CategoryDropdown from "./dropDownCategories";
import PriceFilter from "./priceFilter";
import RatingFilter from "./ratingFilter";
import MaterialTypeDropdown from "./materialDropdown";
import FilterChips from "./filterChip";
import ClientSearchWrapper from "./clientSearchWrapper";
import ClearAllFilters from "./clearAllFilters";

const sortOrders = ["newest", "lowest", "highest", "rating"];
const pageSize = 10; // Default to 10 products per page

// Function to validate image URLs
const isValidImageUrl = (url: string) => {
  return url && (url.startsWith("http://") || url.startsWith("https://"));
};

export default async function SearchPage({
  searchParams: {
    q = "all",
    materialType = "all",
    productCategory = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  },
}: {
  searchParams: {
    q: string;
    materialType: string;
    productCategory: string;
    category: string;
    price: string;
    rating: string;
    sort: string;
    page: string;
  };
}) {
  const currentPage = Number(page);

  const getFilterUrl = ({
    c,
    m,
    pc,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    m?: string;
    pc?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params: any = {
      q,
      productCategory,
      price,
      rating,
      sort,
      page,
      materialType,
      category,
    };
    if (c) params.productCategory = c;
    if (m) params.materialType = m;
    if (pc) params.category = pc;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;
    if (s) params.sort = s;
    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const categories = await productServices.getCategories();
  const materials = await productServices.getMaterialTypes();

  const { countProducts, products, pages } = await productServices.getByQuery({
    productCategory,
    category,
    q,
    price,
    rating,
    page: currentPage.toString(),
    sort,
    materialType,
  });

  const validProducts = products?.filter((product) =>
    isValidImageUrl(product?.image ?? "")
  );

  // Pagination Logic
  const startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(pages, startPage + 2);

  return (
    <div className="grid md:grid-cols-5 gap-6 p-6">
      {/* Filters Section */}
      <div className="space-y-4">
        <div>
          <span className="flex items-center justify-between">
            <div>Filters</div>
            {/* <ClearAllFilters /> */}
          </span>
        </div>
        <div>
          <hr />
        </div>
        <MaterialTypeDropdown
          materials={materials}
          selectedMaterialType={materialType}
          q={q}
          materialType={materialType}
          price={price}
          rating={rating}
          sort={sort}
          page={page}
          productCategory={productCategory}
        />{" "}
         <div className="p-0 m-0">
          <hr />
        </div>
        <CategoryDropdown
          categories={categories}
          selectedCategory={productCategory}
          q={q}
          productCategory={productCategory}
          price={price}
          rating={rating}
          sort={sort}
          page={page}
          materialType={materialType}
        />{" "}
        <div className="p-0 m-0">
          <hr />
        </div>
        <PriceFilter
          selectedPrice={price}
          q={q}
          productCategory={productCategory}
          rating={rating}
          sort={sort}
          page={page}
          materialType={materialType}
        />{" "}
       <div className="p-0 m-0">
          <hr />
        </div>
        {/* <RatingFilter
          selectedRating={rating}
          q={q}
          productCategory={productCategory}
          price={price}
          sort={sort}
          page={page}
        /> */}
      </div>

      {/* Results Section */}
      <div className="md:col-span-4">
        <div className="flex justify-between items-center mb-6">
          <FilterChips
            q={q}
            productCategory={productCategory}
            category={category}
            price={price}
            rating={rating}
            sort={sort}
            page={page}
            materialType={materialType}
          />
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
        <ClientSearchWrapper>
          {validProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {validProducts.map((product) => (
                  <ProductItem key={product.slug} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex justify-center items-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={getFilterUrl({ pg: String(currentPage - 1) })}
                    className="px-4 py-2 rounded-md border border-pink-500 text-pink-500"
                  >
                    {"<<"}
                  </Link>
                )}

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

                {currentPage < pages && (
                  <Link
                    href={getFilterUrl({ pg: String(currentPage + 1) })}
                    className="px-4 py-2 rounded-md border border-pink-500 text-pink-500"
                  >
                    {">>"}
                  </Link>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
              <div className="animate-bounce text-6xl mb-4">💔</div>
              <h2 className="text-2xl font-semibold text-pink-600 mb-2">
                Oops! Nothing Found
              </h2>
              <p className="text-gray-500 mb-6">
                Looks like we couldn’t find what you were looking for.
              </p>
              <div className="text-sm italic text-gray-400">
                “Remember the good ol’ days? We’re working hard to bring that
                magic back!”
              </div>
            </div>
          )}
        </ClientSearchWrapper>
      </div>
    </div>
  );
}
