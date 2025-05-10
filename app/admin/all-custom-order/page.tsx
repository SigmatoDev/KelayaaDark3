import AdminLayout from "@/components/admin/AdminLayout";
import CustomOrdersPage from "../custom-orders/customOrders";

export const metadata = {
  title: "Admin Orders",
};

const AdminOrdersPage = () => {
  return (
    <AdminLayout activeItem="custom orders">
      <CustomOrdersPage />
    </AdminLayout>
  );
};

export default AdminOrdersPage;
