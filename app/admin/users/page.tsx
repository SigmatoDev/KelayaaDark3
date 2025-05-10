import AdminLayout from "@/components/admin/AdminLayout";
import UsersPage from "./usersPage";

export const metadata = {
  title: "Admin Users",
};
const AdminUsersPage = () => {
  return (
    <AdminLayout activeItem="users">
      <UsersPage />
    </AdminLayout>
  );
};

export default AdminUsersPage;
