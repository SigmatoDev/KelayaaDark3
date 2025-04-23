"use client";

import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import { Sheet, SheetContent } from "@/components/ui/Sheet";
import MaterialTypeDropdown from "./materialDropdown";
import CategoryDropdown from "./dropDownCategories";
import StyleFilter from "./styleFilter";
import PriceFilter from "./priceFilter";
import CollectionTypeFilter from "./collectionTypeFilter";

export default function MobileFilter({
  materials,
  categories,
  materialType,
  productCategory,
  category,
  price,
  rating,
  sort,
  page,
  q,
  collectionType,
  collectionTypes,
  productCategoriesByCollectionType,
  productTypeByProductCategory,
  combineCategoryAndSubcategory,
  materialTypeCounts = [],
}: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-0 right-0 z-[100] md:hidden m-2">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-black p-3 rounded-full text-white shadow-lg flex items-center gap-2"
        >
          <FaFilter className="w-4 h-4" />
          <span className="text-sm">Filter</span>
        </button>
      )}

      {open && (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="bottom"
            className="fixed inset-y-0 right-0 w-[90%] max-w-sm bg-white shadow-lg transform transition-transform duration-300 translate-x-0 z-[101] flex flex-col"
          >
            <div className="flex justify-between items-center mb-4 px-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                className="text-sm text-gray-500 hover:text-red-500"
                onClick={() => setOpen(false)}
              >
                ✕ Close
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto space-y-4 px-4 pb-24">
              <MaterialTypeDropdown
                materials={materials}
                selectedMaterialType={materialType}
                q={q}
                price={price}
                rating={rating}
                sort={sort}
                page={page}
                productCategory={productCategory}
                collectionType={collectionType}
                materialTypeCounts={materialTypeCounts}
                materialType={materialType}
              />

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

              {productCategory !== "all" &&
                productTypeByProductCategory.length > 0 && (
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
            </div>

            {/* Fixed apply button */}
            <div className="fixed bottom-0 left-0 w-full bg-white px-4 py-3 border-t border-gray-200">
              <button
                onClick={() => setOpen(false)}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg text-sm font-medium"
              >
                Apply Filters
              </button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
