import React, { ReactNode } from "react";
import AccountSidebar from "./my-account/AccountSidebar";

const AccountLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex justify-center min-h-screen py-8">
      <div className="flex w-full max-w-6xl bg-white  overflow-hidden">
        <AccountSidebar />
        <div className="flex-1 p-6">{children}</div>
      </div>
    </div>
  );
};

export default AccountLayout;
