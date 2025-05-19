import { notFound } from "next/navigation";
import productService from "@/lib/services/productService";
import ProductPageContent from "./ProductContent";
import ProductItem from "@/components/products/ProductItem";

// Define Product interface
interface Pricing {
  diamondPrice: number;
  goldPrice: number;
  grossWeight: number;
  pricePerGram: number;
  makingCharges: number;
  diamondTotal: number;
  goldTotal: number;
  totalPrice: number;
  gst: number;
}

interface Item {
  productCategory: string;
  gemCut: string;
  carats: number;
  clarity: string;
  color: string;
  goldPurity: string;
  pricing: Pricing;
}

interface Product {
  materialType: string | undefined;
  subCategories: never[];
  _id: string;
  name: string;
  productCode: string;
  weight: string;
  price_per_gram: string;
  info: string;
  slug: string;
  image: string;
  price: number;
  description: string;
  category: string;
  productCategory: string;
  countInStock: number;
  reviewsCount: number;
  tags: string[];
  images: string[];

  // ✅ Additional fields required by ProductPageContent
  productType?: string;
  size?: string;
  ring_size?: string;
  carats?: number;
  pricing?: Pricing;
  items?: Item[]; // For jewelry sets
}

// 🔄 Updated: fetch product using productCode
async function getProduct(productCode: string): Promise<Product> {
  const product = (await productService.getByProductCode(
    productCode
  )) as Partial<Product>;

  if (!product) {
    notFound();
  }

  return {
    ...product,
    _id: product._id || "",
    reviewsCount: product.reviewsCount ?? 0,
    tags: product.tags ?? [],
  } as Product;
}

// Updated: generate metadata using productCode
export const generateMetadata = async ({
  params,
}: {
  params: { productCode: string };
}) => {
  const product = await getProduct(params.productCode);

  return {
    title: product.name,
    description: product.description,
  };
};

// Updated: main page fetch
const ProductPage = async ({ params }: { params: { productCode: string } }) => {
  const product = await getProduct(params.productCode);

  console.log("products", product);

  const similarProducts = await productService.getSimilarProducts(
    product.productCategory,
    product.category,
    product.subCategories || [],
    product.materialType,
    product.productCode,
    product.productType
  );
  console.log("similar", similarProducts);

  return (
    <>
      <ProductPageContent product={product} similarProducts={similarProducts} />

      {/* {similarProducts?.length > 0 && (
        <section className="mt-10 px-4">
          <h2 className="text-2xl font-semibold mb-4">Similar Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {similarProducts.map((item) => (
              <ProductItem product={item} />
            ))}
          </div>
        </section>
      )} */}
    </>
  );
};

export default ProductPage;
