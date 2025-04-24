import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductType {
  productType?: string;
  size?: number | string;
  goldPurity?: string;
  gemCut?: string;
  materialType?: string;
}

export default function BangleDetails({ product }: { product: ProductType }) {
  const router = useRouter();

  if (product?.productType !== "Bangles") return null;

  return (
    <div className="space-y-4">
      {/* Info row with customize button */}
      <div className="flex border border-yellow-400 overflow-hidden divide-x divide-yellow-400 text-center">
        {/* Size */}
        <div className="flex-1 px-4 py-2">
          <p className="text-xs text-gray-500 mb-1">Size</p>
          <div className="flex items-center justify-center h-5">
            <p className="font-semibold text-sm">
              {product?.size}
              {product?.size && typeof product?.size === "number"
                ? " (57.8 mm)"
                : ""}
            </p>
          </div>
        </div>

        {/* Metal */}
        <div className="flex-1 px-4 py-2">
          <p className="text-xs text-gray-500 mb-1">Metal</p>
          <div className="flex items-center justify-center h-5">
            <p className="font-semibold text-sm">
              {product?.items[0]?.goldPurity || "-"}
            </p>
          </div>
        </div>

        {/* Diamond */}
        {product?.materialType === "gold" && (
          <div className="flex-1 px-4 py-2">
            <p className="text-xs text-gray-500 mb-1">Diamond</p>
            <div className="flex items-center justify-center h-5">
              <p className="font-semibold text-[0.7rem]">
                {product?.items[0]?.gemCut || "-"}
              </p>
            </div>
          </div>
        )}

        {/* CUSTOMISE Button */}
        <div
          onClick={() => router.push("/custom-design")}
          className="flex items-center justify-center bg-yellow-400 px-6 cursor-pointer hover:bg-yellow-500 text-sm font-bold text-black"
        >
          CUSTOMISE
        </div>
      </div>
      {/* Learn how box */}
      <div className="relative bg-purple-100 text-purple-700 px-4 py-3 ">
        <div className="absolute -top-2 left-6 w-4 h-4 bg-purple-100 rotate-45"></div>
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">
            Not sure about your bangle size?
          </p>
          <a
            href="/ring-bangle-size-guide"
            className="text-pink-500 text-sm font-semibold flex items-center gap-1"
          >
            LEARN HOW <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
