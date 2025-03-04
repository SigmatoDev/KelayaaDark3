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
}

// Add shared product fetching function
async function getProduct(slug: string): Promise<Product> {
  const product = await productService.getBySlug(slug) as Partial<Product>;
  
  if (!product) {
    notFound();
  }
  
  return {
    ...product,
    _id: product._id || '', // Ensure _id is never undefined
    reviewsCount: product.reviewsCount ?? 0,
    tags: product.tags ?? [],
  } as Product;
}

// ✅ This function must stay in a Server Component
export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const product = await getProduct(params.slug);

  return {
    title: product.name,
    description: product.description,
  };
};

// ✅ Fetch data on the server & pass it to the client
const ProductPage = async ({ params }: { params: { slug: string } }) => {
  const product = await getProduct(params.slug);
  return <ProductPageContent product={product} />;
};

export default ProductPage;
