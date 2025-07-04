"use client";

import Link from "next/link";
import {
  Home,
  ShoppingBag,
  Package,
  Users,
  Settings,
  HelpCircle,
  FileText,
  Shield,
  BadgeIndianRupee,
  UploadIcon,
  LogOut,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  {
    name: "Gold Prices",
    href: "/admin/gold-prices",
    icon: BadgeIndianRupee,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
    //? subItems: [
    //   // { name: "Categories", href: "/admin/categories" },
    //   { name: "Products", href: "/admin/products" },
    // ],
  },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Custom Orders", href: "/admin/all-custom-order", icon: ShoppingBag },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  // { name: "Help Center", href: "/admin/help-center", icon: HelpCircle },
  // { name: "FAQ", href: "/admin/faq", icon: FileText },
  // { name: "Privacy Policy", href: "/admin/privacy-policy", icon: Shield },
  // {
  //   name: "Bulk Image Upload",
  //   href: "/admin/bulk-image-upload",
  //   icon: UploadIcon,
  // },
];

const AdminMenu = ({ activeItem }: { activeItem: string }) => {
  console.log("Active Item:", activeItem);

  return (
    <>
      <ul className="menu gap-1 w-full">
        {menuItems.map((item) => {
          // Determine if the parent or any of its sub-items is active
          const isParentActive = item?.subItems
            ? item?.subItems.some(
                (subItem) =>
                  activeItem.toLowerCase() === subItem.name.toLowerCase()
              )
            : false;

          const isActive =
            activeItem.toLowerCase() === item.name.toLowerCase() ||
            isParentActive;

          console.log(
            `Menu Item: ${item.name}, isActive: ${isActive}, isParentActive: ${isParentActive}`
          );

          return (
            <li key={item.name} className="w-full">
              <Link
                href={item.href}
                className={`block p-2 rounded-md w-full text-gray-400 ${
                  isActive
                    ? "bg-gray-700 text-gray-100" // Active item background color
                    : "hover:bg-gray-700 hover:text-gray-100" // Hover state background color
                }`}
              >
                <div className="flex items-center">
                  <item.icon className={`w-5 h-5 mr-2`} />
                  {item.name}
                </div>
              </Link>
              {item?.subItems && (
                <ul className="ml-6 mt-2 space-y-1">
                  {item?.subItems.map((subItem) => {
                    // Sub-item active check
                    const isSubItemActive =
                      activeItem.toLowerCase() === subItem.name.toLowerCase();

                    console.log(
                      `Sub-item: ${subItem.name}, isSubItemActive: ${isSubItemActive}`
                    );

                    return (
                      <li key={subItem.name} className="w-full">
                        <Link
                          href={subItem.href}
                          className={`block p-2 rounded-md w-full ${
                            isSubItemActive
                              ? "text-blue-500" // Active sub-item background color
                              : "hover:bg-gray-300" // Hover state background color
                          }`}
                        >
                          - {subItem.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default AdminMenu;
