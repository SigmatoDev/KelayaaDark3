import AdminLayout from "@/components/admin/AdminLayout";
import AdminSettingsPanel from "./AdminPanelSettings";

export const metadata = {
  title: "Admin Settings",
};
const DashbaordPage = () => {
  return (
    <AdminLayout activeItem="settings">
      <AdminSettingsPanel />
    </AdminLayout>
  );
};

export default DashbaordPage;
