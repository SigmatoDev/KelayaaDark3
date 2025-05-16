import AdminLayout from "@/components/admin/AdminLayout";
import OrderDetails from "./OrderDetails";

export const generateMetadata = ({ params }: { params: { id: string } }) => {
  return {
    title: `Order ${params.id}`,
  };
};

const OrderDetailsPage = ({ params }: { params: { id: string } }) => {
  return (
    <AdminLayout activeItem="customer-orders">
      <OrderDetails orderId={params.id} />
    </AdminLayout>
  );
};

export default OrderDetailsPage;
