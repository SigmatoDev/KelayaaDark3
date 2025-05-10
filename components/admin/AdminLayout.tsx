import { auth } from "@/lib/auth";
import AdminMenu from "./AdminMenu";

const AdminLayout = async ({
  activeItem = "dashboard",
  children,
}: {
  activeItem: string;
  children: React.ReactNode;
}) => {
  const session = await auth();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Fixed and scroll independent */}
      <div className="w-[250px] py-2 bg-gray-900 text-white fixed top-[60px] left-0 h-[calc(100%-60px)] overflow-y-auto z-40">
        <AdminMenu activeItem={activeItem} />
      </div>

      {/* Main content - scrollable */}
      <div className="ml-[250px] flex-1 overflow-y-auto p-2  pt-[60px]">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
