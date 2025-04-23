"use client";

import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";
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
  const [open, setOpen] = useState(false); // start closed

  return (
    <div className="fixed bottom-4 left-4 z-[100] md:hidden">

       
<Sheet open={open} onOpenChange={setOpen}>
<SheetTrigger onClick={() => setOpen(true)}>
  <div className="bg-black p-3 rounded-full text-white shadow-lg flex items-center gap-2">
    <FaFilter className="w-4 h-4" />
    <span className="text-sm">Filter</span>
  </div>
</SheetTrigger>

  {open && (
    
 






        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto p-4">
          {/* Close button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              className="text-sm text-gray-500 hover:text-red-500"
              onClick={() => setOpen(false)}
            >
              ✕ Close
            </button>
          </div>

          <div className="space-y-4">
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

          {/* Apply button */}
          <div className="mt-6">
            <button
              onClick={() => setOpen(false)}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg text-sm font-medium"
            >
              Apply Filters
            </button>
          </div>
        </SheetContent>
      )}
</Sheet>
    </div>
  );
}
