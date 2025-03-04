import AdminLayout from "@/components/admin/AdminLayout";
import PrivacyPolicy from "./deatils";

const PrivacyPolicyPage = () => {
  return (
    <AdminLayout activeItem="privacy-policy">
      <PrivacyPolicy />
    </AdminLayout>
  );
};

export default PrivacyPolicyPage;
