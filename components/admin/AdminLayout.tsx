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
  // Uncomment for authentication check
  // if (!session || !session.user.isAdmin) {
  //   return (
  //     <div className='relative flex flex-grow p-4'>
  //       <div>
  //         <h1 className='text-2xl'>Unauthorized</h1>
  //         <p>Admin permission required</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="relative flex flex-grow">
      <div className="grid w-full md:grid-cols-5">
        <div className="bg-base-200 px-2">
          {/* Import and render the menu component */}
          <AdminMenu activeItem={activeItem} />
        </div>
        <div className="px-[55px] py-8 md:col-span-4">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
