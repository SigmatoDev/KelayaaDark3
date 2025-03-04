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
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  {
    name: "Gold Price Update",
    href: "/admin/gold-price-update",
    icon: BadgeIndianRupee,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
    subItems: [
      // { name: "Categories", href: "/admin/categories" },
      { name: "Products", href: "/admin/products" },
    ],
  },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Help Center", href: "/admin/help-center", icon: HelpCircle },
  { name: "FAQ", href: "/admin/faq", icon: FileText },
  { name: "Privacy Policy", href: "/admin/privacy-policy", icon: Shield },
];

const AdminMenu = ({ activeItem }: { activeItem: string }) => {
  console.log("Active Item:", activeItem);

  return (
    <>
      <div className="my-2 mb-4">
        <img
          src="/Kelayaa1.png" // Path to your logo file (transparent background)
          alt="Silver Shine"
          className="w-[50%]"
          style={{
            filter: "contrast(150%)", // Adjusting contrast and brightness
          }}
        />
      </div>
      <ul className="menu gap-1 w-full">
        {menuItems.map((item) => {
          // Determine if the parent or any of its sub-items is active
          const isParentActive = item.subItems
            ? item.subItems.some(
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
                className={`block p-2 rounded-md w-full ${
                  isActive
                    ? "bg-gray-700 text-white" // Active item background color
                    : "hover:bg-gray-800" // Hover state background color
                }`}
              >
                <div className="flex items-center">
                  <item.icon className={`w-5 h-5 mr-2`} />
                  {item.name}
                </div>
              </Link>
              {item.subItems && (
                <ul className="ml-6 mt-2 space-y-1">
                  {item.subItems.map((subItem) => {
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
                              : "hover:bg-gray-800" // Hover state background color
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
