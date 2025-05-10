import AdminLayout from "@/components/admin/AdminLayout";

import GoldPriceTable from "./Gold-price-table";
import GoldPriceChart from "./gold-price-chart";

const FAQPage = () => {
  return (
    <AdminLayout activeItem="gold-prices">
      <GoldPriceTable />
      {/* <GoldPriceChart /> */}
    </AdminLayout>
  );
};

export default FAQPage;
