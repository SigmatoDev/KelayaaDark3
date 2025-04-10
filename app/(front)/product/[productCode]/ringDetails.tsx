import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductType {
  productCategory?: string;
  ring_size?: number | string;
  size?: number | string;
  goldPurity?: string;
  gemCut?: string;
  materialType?: string;
}

export default function RingDetails({ product }: { product: ProductType }) {
  const ringSize =
    product?.productCategory === "Rings" ? product?.ring_size : product?.size;

  const router = useRouter();
  return (
    <div className="space-y-4">
      {/* Info row with customize button */}
      <div className="flex rounded-full border border-yellow-400 overflow-hidden divide-x divide-yellow-400 text-center">
        {/* Size */}
        <div className="flex-1 px-4 py-2">
          <p className="text-xs text-gray-500 mb-1">Size</p>
          <div className="flex items-center justify-center h-5">
            <p className="font-semibold text-sm">
              {ringSize}
              {ringSize && typeof ringSize === "number" ? " (57.8 mm)" : ""}
            </p>
          </div>
        </div>

        {/* Metal */}
        <div className="flex-1 px-4 py-2">
          <p className="text-xs text-gray-500 mb-1">Metal</p>
          <div className="flex items-center justify-center h-5">
            <p className="font-semibold text-sm">
              {product?.goldPurity || "18 KT_Yellow"}
            </p>
          </div>
        </div>

        {product?.materialType === "gold" && (
          <div className="flex-1 px-4 py-2">
            <p className="text-xs text-gray-500 mb-1">Diamond</p>
            <div className="flex items-center justify-center h-5">
              <p className="font-semibold text-[0.7rem]">
                {product?.gemCut || "FG-SI"}
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
      <div className="relative bg-purple-100 text-purple-700 px-4 py-3 rounded-xl">
        <div className="absolute -top-2 left-6 w-4 h-4 bg-purple-100 rotate-45"></div>
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">Not sure about your ring size?</p>
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
