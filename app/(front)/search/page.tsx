import Link from "next/link";
import ProductItem from "@/components/products/ProductItem";
import { Rating } from "@/components/products/Rating";
import productServices from "@/lib/services/productService";
import CategoryDropdown from "./dropDownCategories";
import PriceFilter from "./priceFilter";
import RatingFilter from "./ratingFilter";
import MaterialTypeDropdown from "./materialDropdown";
import FilterChips from "./filterChip";
import StyleFilter from "./styleFilter";
import ClearAllFilters from "./clearAllFilters";
import ClientSearchWrapper from "./clientSearchWrapper";
import CollectionTypeFilter from "./collectionTypeFilter";
// import ClientSearchWrapper from "./clientSearchWrapper";
// import ClearAllFilters from "./clearAllFilters";
import MobileFilter from "./MobileFilter";

const sortOrders = ["newest", "lowest", "highest"];
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
    collectionType = "all",
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
    collectionType: string;
  };
}) {
  const currentPage = Number(page);

  const getFilterUrl = ({
    q: qParam,
    m,
    pc,
    c,
    p,
    r,
    s,
    pg,
    ct,
  }: {
    q?: string;
    m?: string;
    pc?: string;
    c?: string;
    p?: string;
    r?: string;
    s?: string;
    pg?: string;
    ct?: string;
  }) => {
    const finalParams: Record<string, string> = {};

    if (qParam ?? q) finalParams.q = qParam ?? q;
    if (m ?? materialType) finalParams.materialType = m ?? materialType;
    if (pc ?? productCategory)
      finalParams.productCategory = pc ?? productCategory;
    if ((pc || c) && (c ?? category)) finalParams.category = c ?? category; // only include if pc or c exists
    if (p ?? price) finalParams.price = p ?? price;
    if (r ?? rating) finalParams.rating = r ?? rating;
    if (s ?? sort) finalParams.sort = s ?? sort;
    if (pg ?? page) finalParams.page = pg ?? page;
    if (ct ?? collectionType) finalParams.collectionType = ct ?? collectionType;

    const params = new URLSearchParams(finalParams);
    const finalUrl = `/search?${params.toString()}`;

    console.log("🔗 Generated Filter URL:", finalUrl);
    return finalUrl;
  };

  const categories = await productServices.getCategories();
  const materials = await productServices.getMaterialTypes();
  const combineCategoryAndSubcategory =
    await productServices.getCombinedCategoriesAndSubcategories();
  const productTypeByProductCategory =
    await productServices.getCombinedByProductCategory(
      productCategory,
      materialType
    );

  const materialTypeCounts = await productServices.getMaterialTypesWithCounts();
  const collectionTypes = await productServices.getDistinctCollectionTypes();
  const productCategoriesByCollectionType =
    await productServices.getCategoriesByCollectionAndMaterialType(
      collectionType,
      materialType
    );

  const getBeadsStyles = await productServices.getDistinctBeadsStyles();
  const { countProducts, products, pages } = await productServices.getByQuery({
    productCategory,
    category,
    q,
    price,
    rating,
    page: currentPage.toString(),
    sort,
    materialType,
    collectionType,
  });

  const validProducts = products;

  // Pagination Logic
  const startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(pages, startPage + 2);
  console.log("materialType", materialType);
  return (
    <div className="w-full overflow-x-hidden">
      <div className="grid md:grid-cols-5 gap-6 p-6">
        {/* Filters Section */}
        <div className="hidden md:sticky md:top-6 md:max-h-[calc(100vh-3rem)] md:overflow-y-auto md:pr-2 md:space-y-4 md:block">
          <div>
            <span className="flex items-center justify-between">
              <div>Filters</div>
              <ClearAllFilters />
            </span>
          </div>
          <div>
            <hr />
          </div>

          {/* 👇 Always show MaterialTypeDropdown */}
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
            materialTypeCounts={materialTypeCounts}
            collectionType={collectionType}
          />
          <div className="p-0 m-0">
            <hr />
          </div>

          {/* 🎯 Conditionally show only StyleFilter if materialType is "Beads" */}
          {materialType.includes("Beads") ? (
            <>
              <StyleFilter
                category={getBeadsStyles}
                selectedCategory={category}
                q={q}
                productCategory={productCategory}
                price={price}
                rating={rating}
                sort={sort}
                page={page}
                materialType={materialType}
                collectionType={collectionType}
              />
              <div className="p-0 m-0">
                <hr />
              </div>
            </>
          ) : (
            <>
              <CategoryDropdown
                categories={
                  (collectionType !== "all" || materialType !== "all") &&
                  productCategoriesByCollectionType.length > 0
                    ? productCategoriesByCollectionType
                    : categories
                }
                selectedCategory={productCategory}
                q={q}
                productCategory={productCategory}
                price={price}
                rating={rating}
                sort={sort}
                page={page}
                materialType={materialType}
                collectionType={collectionType}
              />
              <div className="p-0 m-0">
                <hr />
              </div>

              {productCategory !== "all" &&
                productTypeByProductCategory.length > 0 && (
                  <>
                    <StyleFilter
                      category={
                        productCategory === "all"
                          ? combineCategoryAndSubcategory
                          : productTypeByProductCategory
                      }
                      selectedCategory={category}
                      q={q}
                      productCategory={productCategory}
                      price={price}
                      rating={rating}
                      sort={sort}
                      page={page}
                      materialType={materialType}
                      collectionType={collectionType}
                    />
                    <div className="p-0 m-0">
                      <hr />
                    </div>
                  </>
                )}

              <PriceFilter
                selectedPrice={price}
                q={q}
                productCategory={productCategory}
                rating={rating}
                sort={sort}
                page={page}
                materialType={materialType}
                collectionType={collectionType}
              />
              <div className="p-0 m-0">
                <hr />
              </div>

              <CollectionTypeFilter
                collectionTypes={collectionTypes}
                selectedCollectionType={collectionType}
                q={q}
                productCategory={productCategory}
                price={price}
                rating={rating}
                sort={sort}
                page={page}
                materialType={materialType}
              />
              <div className="p-0 m-0">
                <hr />
              </div>
            </>
          )}
        </div>

        {/* Results Section */}
        <div className="md:col-span-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            {/* Filter Chips (top on mobile) */}
            <FilterChips
              q={q}
              productCategory={productCategory}
              category={category}
              price={price}
              rating={rating}
              sort={sort}
              page={page}
              materialType={materialType}
              collectionType={collectionType}
            />

            {/* Sort and showing products (below on mobile) */}
            <div className="flex flex-wrap items-center justify-end gap-2 text-[12px]">
              <div className="px-2 py-1">
                Showing{" "}
                <span className="font-semibold text-[14px] text-[#e688a2]">
                  {validProducts.length}
                </span>{" "}
                product{validProducts.length !== 1 && "s"}
              </div>
              <span className="hidden md:block">Sort by:</span>
              {sortOrders.map((s) => (
                <Link
                  key={s}
                  href={getFilterUrl({ s })}
                  className={`px-3 py-1 text-[12px] hidden md:block rounded-md ${
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

          <div>
            {validProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {/* {validProducts.map((product) => (
                  <ProductItem key={product.slug} product={product} />
                ))} */}

                  {/* changed by nuthan */}
                  {validProducts.map((product, index) => (
                    <ProductItem
                      key={`${product.slug}-${index}`}
                      product={product}
                    />
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
                          ? "bg-[#e688a2] text-white"
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
          </div>

          {/* Floating Mobile Filters */}
          <MobileFilter
            materials={materials}
            categories={categories}
            materialType={materialType}
            productCategory={productCategory}
            category={category}
            price={price}
            rating={rating}
            sort={sort}
            page={page}
            q={q}
            collectionType={collectionType}
            collectionTypes={collectionTypes}
            productCategoriesByCollectionType={
              productCategoriesByCollectionType
            }
            productTypeByProductCategory={productTypeByProductCategory}
            combineCategoryAndSubcategory={combineCategoryAndSubcategory}
            materialTypeCounts={materialTypeCounts}
          />
        </div>
      </div>
    </div>
  );
}
