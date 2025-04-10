import { notFound } from "next/navigation";
import productService from "@/lib/services/productService";
import ProductPageContent from "./ProductContent";

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
  console.log("productCode", params.productCode, product);
  return <ProductPageContent product={product} />;
};

export default ProductPage;
