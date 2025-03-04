import AdminLayout from "@/components/admin/AdminLayout";

import Form from "./Form";
import UploadProductExcelFile from "./UploadExcelFile";

export function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Add Product`,
  };
}

export default function ProductAddPage() {
  return (
    <AdminLayout activeItem="products">
      <Form />
      <UploadProductExcelFile />
    </AdminLayout>
  );
}
