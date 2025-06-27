import AdminLayout from "@/components/admin/AdminLayout";
import SetProductCreateForm from "./Form";
import BackButton from "@/components/back-button/page";

export function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Add Set Product`,
  };
}

export default function ProductAddPage() {
  return (
    <div className="space-y-2 p-4 pt-[20px]">
      <AdminLayout activeItem="products">
        <div className="flex-row items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            Product Management
          </h1>
          <BackButton label="Go Back" />
        </div>

        <SetProductCreateForm />
      </AdminLayout>
    </div>
  );
}
