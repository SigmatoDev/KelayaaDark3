import productService from "@/lib/services/productService";
import ProductItem from "@/components/products/ProductItem";
import MaterialTypeDropdown from "./materialTypeDropDown";

// Define Product interface
interface Product {
  _id?: string;
  name: string;
  productCode: string;
  // weight: string;
  // price_per_gram: string;
  // info: string;
  slug: string;
  // image: string;
  price: number;
  description: string;
  // category: string;
  // productCategory: string;
  countInStock: number;
  // reviewsCount: number;
  // tags: string[];
  images: string[];
  // materialType: string;
}

// ✅ Fetch products server-side
async function getProductsByCategory(category: string): Promise<Product[]> {
  if (!category) return [];
  try {
    const products = await productService.getByCategory(category);

    return products.map((p) => ({
      ...p,
      slug: p.slug ?? p.name.replace(/\s+/g, "-").toLowerCase(), // Auto-generate slug if missing
    }));
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return [];
  }
}

// ✅ Generate dynamic metadata (SEO)
export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}) => ({
  title: `${params.slug} - Products`,
  description: `Browse the best ${params.slug} products.`,
});

// ✅ Server Component: Fetch data & render UI
const CategoryPage = async ({ params }: { params: { slug: string } }) => {
  const products = await getProductsByCategory(params.slug);

  return (
    <div className="max-w-fit mx-auto">
      <h1 className="text-3xl font-bold text-center capitalize my-6">
        {params.slug} Collection
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((p) => <ProductItem key={p?.slug} product={p} />)
        ) : (
          <div className="text-center col-span-full text-gray-600">
            <p>No products found in this category.</p>
            <p className="mt-2">
              Explore other{" "}
              <a href="/" className="text-blue-500 underline">
                collections
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
