import AdminLayout from "@/components/admin/AdminLayout";

import Form from "./Form";
import UploadProductExcelFile from "./UploadExcelFile";
import UploadGoldProductExcelFile from "./UplaodGoldProducts";
import UploadGoldDiamondProductPricingExcelFile from "./UploadGoldDiamondPricdeatilsExcel";
import ExcelUploader from "./updatingExcelCloumn";
import UploadSetProductExcelFile from "./setsUpload";
import SetPricingUpload from "./setsPricingUpload";
import UploadBeadsProductExcelFile from "./UploadBeads";

export function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Add Product`,
  };
}

export default function ProductAddPage() {
  return (
    <div className="space-y-2 p-4 pt-[20px]">
      <AdminLayout activeItem="products">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Product Management
        </h1>

        <Form />

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-lg p-4 md:p-6 w-full max-w-[400px] overflow-hidden">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Upload Silver Products
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Upload an Excel file containing general product details.
            </p>
            <UploadProductExcelFile />
          </div>

          <div className="bg-white shadow-md rounded-lg p-4 md:p-6 w-full max-w-[400px] overflow-hidden">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Upload Gold Products
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Upload an Excel file for gold-based products.
            </p>
            <UploadGoldProductExcelFile />
          </div>

          <div className="bg-white shadow-md rounded-lg p-4 md:p-6 w-full max-w-[400px] overflow-hidden">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Upload Gold & Diamond Pricing
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Upload an Excel file with pricing details for gold & diamond
              products.
            </p>
            <UploadGoldDiamondProductPricingExcelFile />
          </div>

          <div className="bg-white shadow-md rounded-lg p-4 md:p-6 w-full max-w-[400px] overflow-hidden">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Upload Sets Product
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Upload an Excel file with pricing details for sets products.
            </p>
            <UploadSetProductExcelFile />
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 md:p-6 w-full max-w-[400px] overflow-hidden">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Upload Beads Product
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Upload an Excel file with pricing details for beads products.
            </p>
            <UploadBeadsProductExcelFile />
          </div>
        </div> */}

        {/* <ExcelUploader /> */}
        {/* <SetPricingUpload /> */}

        {/* beads */}
      </AdminLayout>
    </div>
  );
}
