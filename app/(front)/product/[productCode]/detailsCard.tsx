import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { GiCutDiamond, GiGoldBar } from "react-icons/gi";
import { Button } from "@/components/ui/button";

interface Product {
  productType: string;
  materialType?: string;
  goldPurity?: string;
  gemCut?: string;
  carats?: number;
  clarity?: string;
  color?: string;
  diamondType?: string;
  pricing: {
    grossWeight: number;
    goldPrice: number;
    goldTotal: number;
    diamondPrice: number;
    diamondTotal: number;
    makingCharge: number;
    additionalCharges?: number;
    totalPrice: number;
  };
}

export default function PriceBreakupCard({ product }: { product: Product }) {
  const [isOpen, setIsOpen] = useState(false);
  const goldIcon = <GiGoldBar className="text-yellow-500 inline-block mr-2" />;
  const diamondIcon = (
    <GiCutDiamond className="text-blue-500 inline-block mr-2" />
  );

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  const {
    grossWeight,
    goldPrice,
    goldTotal,
    diamondPrice,
    diamondTotal,
    makingCharge,
    additionalCharges,
    totalPrice,
  } = product.pricing;

  return (
    <div className="space-y-4">
      {/* Gold and Diamond Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gold Section */}
        <div className="border border-yellow-200 rounded-lg p-4 shadow bg-gradient-to-br from-yellow-50 to-yellow-100">
          <h3 className="text-md font-semibold text-yellow-600 flex items-center">
            {goldIcon} Gold Details
          </h3>
          <div className="text-xs mt-2 space-y-1">
            <p>
              Purity:{" "}
              <span className="font-medium">{product.goldPurity || "18K"}</span>
            </p>
            <p>
              Weight: <span className="font-medium">{grossWeight} g</span>
            </p>
            <p>
              Rate: ₹
              {goldPrice
                ? goldPrice.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "N/A"}{" "}
              /g
            </p>
          </div>
        </div>

        {/* Diamond Section */}
        <div className="border border-blue-200 rounded-lg p-4 shadow bg-gradient-to-br from-blue-50 to-blue-100">
          <h3 className="text-md font-semibold text-blue-600 flex items-center">
            {diamondIcon} Diamond Details
          </h3>
          <div className="text-xs mt-2 space-y-1">
            <p>Cut: {product.gemCut || "Brilliant Round"}</p>
            <p>
              Carats:{" "}
              <span className="font-medium">
                {product.carats ? product.carats : 0} ct
              </span>
            </p>
            <p>
              Clarity:{" "}
              <span className="font-medium">{product.clarity || "VVS"}</span>
            </p>
            <p>
              Color:{" "}
              <span className="font-medium">{product.color || "E-F"}</span>
            </p>
            {/* <p>
              Rate: ₹
              {diamondPrice
                ? diamondPrice.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "N/A"}{" "}
              /ct
            </p> */}
          </div>
        </div>
      </div>

      {/* Price and Button */}
      {/* <div className="flex justify-between items-center mt-4 p-4 bg-pink-50 rounded-md shadow">
        <span className="text-xl font-bold text-gray">
          Total Price: ₹
          {totalPrice
            ? totalPrice.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : "N/A"}
        </span>
        <Button
          onClick={openDrawer}
          className="bg-[#fff] text-black hover:bg-gray"
        >
          View Price Breakup
        </Button>
      </div> */}

      {/* Slide Drawer */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeDrawer}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-x-full"
            enterTo="opacity-100 translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-x-0"
            leaveTo="opacity-0 translate-x-full"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden flex justify-end">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="w-full max-w-md bg-white p-6 overflow-y-auto shadow-xl rounded-l-2xl">
                <Dialog.Title className="text-xl font-bold text-[#Dd91a6] mb-6">
                  Price Breakup Details
                </Dialog.Title>
                <div className="space-y-4 text-sm text-gray-800">
                  <div className="flex justify-between">
                    <span className="font-medium">Metal Type</span>
                    <span>{product.materialType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Gold Weight</span>
                    <span>{grossWeight} g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Gold Rate</span>
                    <span>
                      ₹
                      {goldPrice
                        ? goldPrice.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : "N/A"}{" "}
                      /g
                    </span>
                  </div>
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>➕ Gold Total</span>
                    <span>
                      ₹
                      {goldTotal
                        ? goldTotal.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : "N/A"}
                    </span>
                  </div>

                  <hr />

                  <div className="flex justify-between">
                    <span className="font-medium">Diamond Type</span>
                    <span>{product.diamondType || "VVS"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Diamond Weight</span>
                    <span>{product.carats || 0} ct</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Diamond Rate</span>
                    <span>
                      ₹
                      {diamondPrice
                        ? diamondPrice.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : "N/A"}{" "}
                      /ct
                    </span>
                  </div>
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>➕ Diamond Total</span>
                    <span>
                      ₹
                      {diamondTotal
                        ? diamondTotal.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : "N/A"}
                    </span>
                  </div>

                  <hr />

                  <div className="flex justify-between text-green-600 font-medium">
                    <span>➕ Making Charges</span>
                    <span>
                      ₹
                      {makingCharge
                        ? makingCharge.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : "N/A"}
                    </span>
                  </div>
                  {additionalCharges ? (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>➕ Additional Charges</span>
                      <span>
                        ₹
                        {additionalCharges
                          ? additionalCharges.toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : "N/A"}
                      </span>
                    </div>
                  ) : null}

                  <div className="border-t pt-4 mt-4 flex justify-between items-center bg-pink-50 rounded-lg px-4 py-2">
                    <span className="text-lg font-semibold text-[#Dd91a6]">
                      Final Price
                    </span>
                    <span className="text-lg font-bold text-[#Dd91a6]">
                      ₹
                      {totalPrice
                        ? totalPrice.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
