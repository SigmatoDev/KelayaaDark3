import { Separator } from "@/components/ui/separator";
import { GiCutDiamond, GiGoldBar } from "react-icons/gi";

interface Item {
  productCategory: string;
  pricing: any;
  grossWeight: number;
  goldPrice: number;
  goldTotal: number;
  diamondPrice: number;
  diamondTotal: number;
  makingCharge: number;
  additionalCharges?: number;
  totalPrice: number;
  gemCut?: string;
  carats?: number;
  clarity?: string;
  color?: string;
  diamondType?: string;
  goldPurity?: string;
  materialType?: string;
  itemName?: string;
}

interface Product {
  name: string;
  materialType: string;
  productType: string;
  items: Item[];
}

export default function SetPriceBreakupCard({ product }: { product: Product }) {
  const goldIcon = <GiGoldBar className="text-yellow-500 inline-block mr-2" />;
  const diamondIcon = (
    <GiCutDiamond className="text-blue-500 inline-block mr-2" />
  );

  const items = product?.items || [];

  return (
    <div className="space-y-6 my-2">
      {items.map((item, index) => (
        <div key={index} className="rounded-xl border border-gray-200 p-4 sm:p-6">
          {/* Product Category / Item Name */}
          <h2 className="text-lg font-bold text-[#Dd91a6] mb-2 sm:mb-4">
            {item?.productCategory || `Item ${index + 1}`}
          </h2>

          {/* Combined Card - Flex row layout */}
          <div className="flex justify-between gap-6">
            {/* Gold Details */}
            <div className="flex-1">
              <h3 className="text-[12px] sm:text-md font-semibold text-yellow-600 flex items-center mb-2">
                {goldIcon} Gold Details
              </h3>
              <div className="text-[10px] sm:text-sm space-y-1 text-gray-700">
                <p>
                  Purity:{" "}
                  <span className="font-medium">
                    {item.goldPurity || "18K"}
                  </span>
                </p>
                <p>
                  Weight:{" "}
                  <span className="font-medium">
                    {item?.pricing.grossWeight} g
                  </span>
                </p>
                <p>
                  Rate: ₹
                  {item?.pricing?.goldPrice?.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || "N/A"}{" "}
                  /g
                </p>
              </div>
            </div>

            {/* Vertical Separator for all screen sizes */}
            <div className="block w-[1px] bg-gray-300 sm:mx-6" />

            {/* Diamond Details */}
            <div className="flex-1">
              <h3 className="text-[12px] sm:text-md font-semibold text-blue-600 flex items-center mb-2">
                {diamondIcon} Diamond Details
              </h3>
              <div className="text-[10px] sm:text-sm space-y-1 text-gray-700">
                <p>Cut: {item.gemCut || "Brilliant Round"}</p>
                <p>
                  Carats:{" "}
                  <span className="font-medium">{item.carats ?? 0} ct</span>
                </p>
                <p>
                  Clarity:{" "}
                  <span className="font-medium">{item.clarity || "VVS"}</span>
                </p>
                <p>
                  Color:{" "}
                  <span className="font-medium">{item.color || "E-F"}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
