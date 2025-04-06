import { notFound } from "next/navigation";
import productService from "@/lib/services/productService";
import ProductPageContent from "./ProductContent";

// Define Product interface
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
