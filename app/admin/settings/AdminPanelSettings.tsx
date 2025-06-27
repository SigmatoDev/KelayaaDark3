"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";
import clsx from "clsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye, EyeOff, Settings, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const SECTIONS = ["Admin Credentials", "Brevo Email Settings"];

interface BrevoEmailState {
  abandonedCartEmail: string;
  orderStatusEmail: string;
  customerJewelrySenderEmail: string;
  customerJewelryRecipientEmails: string[];
  notificationEmail: string;
  adminOrderEmails: string[];
}

const AdminSettingsPage = () => {
  const [activeSection, setActiveSection] = useState(SECTIONS[0]);
  const [loading, setLoading] = useState(false);
  const [emailErrors, setEmailErrors] = useState<Record<string, string>>({});

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Add this with other states
  const [originalEmail, setOriginalEmail] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [brevoEmails, setBrevoEmails] = useState<BrevoEmailState>({
    abandonedCartEmail: "",
    orderStatusEmail: "",
    adminOrderEmails: [],
    customerJewelrySenderEmail: "",
    customerJewelryRecipientEmails: [],
    notificationEmail: "",
  });

  const router = useRouter();

  const signOutHandler = async () => {
    localStorage.removeItem("forceLogout"); // ✅ clear it
    setShowLogoutModal(false);
    await signOut({ redirect: false });
    router.push("/signin");
  };

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (field: keyof BrevoEmailState, value: string) => {
    setBrevoEmails({ ...brevoEmails, [field]: value });

    if (value && !isValidEmail(value)) {
      setEmailErrors((prev) => ({ ...prev, [field]: "Invalid email format" }));
    } else {
      setEmailErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleRecipientEmailChange = (index: number, value: string) => {
    const updated = [...brevoEmails.customerJewelryRecipientEmails];
    updated[index] = value;

    setBrevoEmails({
      ...brevoEmails,
      customerJewelryRecipientEmails: updated,
    });

    if (value && !isValidEmail(value)) {
      setEmailErrors((prev) => ({
        ...prev,
        [`recipient_${index}`]: "Invalid email format",
      }));
    } else {
      setEmailErrors((prev) => {
        const { [`recipient_${index}`]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  // Fetch existing settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get("/api/admin/settings");

        // if (data.adminEmail) setAdminEmail(data.adminEmail);
        if (data.adminEmail) {
          setAdminEmail(data.adminEmail);
          setOriginalEmail(data.adminEmail); // store original
        }

        if (data.brevo) {
          setBrevoEmails({
            abandonedCartEmail: data.brevo.abandonedCartEmail || "",
            orderStatusEmail: data.brevo.orderStatusEmail || "",
            adminOrderEmails: Array.isArray(data.brevo.adminOrderEmails)
              ? data.brevo.adminOrderEmails
              : [],
            customerJewelrySenderEmail:
              data.brevo.customerJewelrySenderEmail || "",
            customerJewelryRecipientEmails: Array.isArray(
              data.brevo.customerJewelryRecipientEmails
            )
              ? data.brevo.customerJewelryRecipientEmails
              : [],
            notificationEmail: data.brevo.notificationEmail || "",
          });
        }
      } catch {
        toast.error("Failed to load settings");
      }
    };
    fetchSettings();
  }, []);

  const handleAdminUpdate = async () => {
    try {
      setLoading(true);
      await axios.put("/api/admin/settings", {
        adminEmail,
        adminPassword,
      });
      toast.success("Admin credentials updated");

      const emailChanged = adminEmail !== originalEmail;
      const passwordChanged = adminPassword.trim() !== "";

      if (emailChanged || passwordChanged) {
        localStorage.setItem("forceLogout", "true"); // ✅ store the flag
        setShowLogoutModal(true);
      }
    } catch {
      toast.error("Failed to update admin settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const logoutFlag = localStorage.getItem("forceLogout");
    if (logoutFlag === "true") {
      setShowLogoutModal(true);
    }
  }, []);

  const handleBrevoUpdate = async () => {
    try {
      setLoading(true);
      await axios.put("/api/admin/settings", {
        brevo: brevoEmails,
      });
      toast.success("Brevo settings updated");
    } catch {
      toast.error("Failed to update Brevo settings");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminEmailChange = (index: number, value: string) => {
    const updated = [...brevoEmails.adminOrderEmails];
    updated[index] = value;

    setBrevoEmails({
      ...brevoEmails,
      adminOrderEmails: updated,
    });

    if (value && !isValidEmail(value)) {
      setEmailErrors((prev) => ({
        ...prev,
        [`order_admin_${index}`]: "Invalid email format",
      }));
    } else {
      setEmailErrors((prev) => {
        const { [`order_admin_${index}`]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  return (
    <div className="flex min-h-screen p-4 bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 border-r bg-white rounded-lg shadow-sm p-4 space-y-4">
        <div className="flex items-center gap-2 font-semibold text-gray-800 text-lg">
          <Settings className="w-5 h-5" />
          Admin Configuration
        </div>
        <Separator />
        {SECTIONS.map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={clsx(
              "w-full text-left px-4 py-2 rounded font-medium",
              activeSection === section
                ? "bg-gray-200 text-gray-700"
                : "hover:bg-gray-100 text-gray-700"
            )}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {activeSection === "Admin Credentials" && (
          <Card className="max-w-xl">
            <CardContent className="space-y-4 pt-6">
              <h2 className="text-xl font-semibold mb-4">Admin Credentials</h2>
              <div className="space-y-4 w-[500px]">
                <div>
                  <Input
                    type="email"
                    placeholder="New Admin Email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    onBlur={(e) =>
                      !isValidEmail(e.target.value) &&
                      toast.error("please enter a valid email")
                    }
                  />
                </div>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Admin Password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <Button
                onClick={handleAdminUpdate}
                disabled={loading}
                className="mt-4 bg-green-600 hover:bg-green-500"
              >
                {loading ? "Updating..." : "Update Admin Settings"}
              </Button>
            </CardContent>
          </Card>
        )}

        {activeSection === "Brevo Email Settings" && (
          <Card className="max-w-3xl">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">
                Brevo Email Configuration
              </h2>
              <Tabs defaultValue="abandoned" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="abandoned">Abandoned Cart</TabsTrigger>
                  <TabsTrigger value="order">Order Status</TabsTrigger>
                  <TabsTrigger value="customer">Custom Jewelry</TabsTrigger>
                  {/* <TabsTrigger value="others">Others</TabsTrigger> */}
                </TabsList>
                <TabsContent
                  value="abandoned"
                  className="space-y-2 pt-4 w-[500px]"
                >
                  <Input
                    type="email"
                    placeholder="Abandoned Cart Email"
                    value={brevoEmails.abandonedCartEmail}
                    onChange={(e) =>
                      handleEmailChange("abandonedCartEmail", e.target.value)
                    }
                    onBlur={(e) =>
                      handleEmailChange("abandonedCartEmail", e.target.value)
                    }
                  />
                  {emailErrors.abandonedCartEmail && (
                    <p className="text-red-500 text-sm">
                      {emailErrors.abandonedCartEmail}
                    </p>
                  )}
                </TabsContent>
                <TabsContent value="order" className="space-y-2 pt-4 w-[500px]">
                  <Input
                    type="email"
                    placeholder="Order Status Update Email"
                    value={brevoEmails.orderStatusEmail}
                    onChange={(e) =>
                      handleEmailChange("orderStatusEmail", e.target.value)
                    }
                    onBlur={(e) =>
                      handleEmailChange("orderStatusEmail", e.target.value)
                    }
                  />
                  {emailErrors.orderStatusEmail && (
                    <p className="text-red-500 text-sm">
                      {emailErrors.orderStatusEmail}
                    </p>
                  )}

                  {/* Admin emails for Order Status */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Admin Emails for Order Status
                    </label>
                    {brevoEmails?.adminOrderEmails.map((email, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) =>
                            handleAdminEmailChange(index, e.target.value)
                          }
                          onBlur={(e) =>
                            handleAdminEmailChange(index, e.target.value)
                          }
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setBrevoEmails((prev) => {
                              const updatedEmails = [...prev.adminOrderEmails];
                              updatedEmails.splice(index, 1); // Remove the email at the specified index
                              return {
                                ...prev,
                                adminOrderEmails: updatedEmails,
                              };
                            })
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} /> {/* X icon to remove email */}
                        </button>
                        {emailErrors[`order_admin_${index}`] && (
                          <p className="text-red-500 text-sm">
                            {emailErrors[`order_admin_${index}`]}
                          </p>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setBrevoEmails((prev) => ({
                          ...prev,
                          adminOrderEmails: [...prev.adminOrderEmails, ""],
                        }))
                      }
                    >
                      ➕ Add Admin Email
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent
                  value="customer"
                  className="space-y-4 pt-4 w-[500px]"
                >
                  <Input
                    type="email"
                    placeholder="Sender Email"
                    value={brevoEmails.customerJewelrySenderEmail}
                    onChange={(e) =>
                      handleEmailChange(
                        "customerJewelrySenderEmail",
                        e.target.value
                      )
                    }
                    onBlur={(e) =>
                      handleEmailChange(
                        "customerJewelrySenderEmail",
                        e.target.value
                      )
                    }
                  />
                  {emailErrors.customerJewelrySenderEmail && (
                    <p className="text-red-500 text-sm">
                      {emailErrors.customerJewelrySenderEmail}
                    </p>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Recipient Emails
                    </label>
                    {brevoEmails.customerJewelryRecipientEmails.map(
                      (email, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) =>
                              handleRecipientEmailChange(index, e.target.value)
                            }
                            onBlur={(e) =>
                              handleRecipientEmailChange(index, e.target.value)
                            }
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setBrevoEmails((prev) => {
                                const updatedEmails = [
                                  ...prev.customerJewelryRecipientEmails,
                                ];
                                updatedEmails.splice(index, 1); // Remove the email at the specified index
                                return {
                                  ...prev,
                                  customerJewelryRecipientEmails: updatedEmails,
                                };
                              })
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={16} /> {/* X icon to remove email */}
                          </button>
                          {emailErrors[`recipient_${index}`] && (
                            <p className="text-red-500 text-sm">
                              {emailErrors[`recipient_${index}`]}
                            </p>
                          )}
                        </div>
                      )
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setBrevoEmails((prev) => ({
                          ...prev,
                          customerJewelryRecipientEmails: [
                            ...prev.customerJewelryRecipientEmails,
                            "",
                          ],
                        }))
                      }
                    >
                      ➕ Add Recipient Email
                    </Button>
                  </div>
                </TabsContent>
                {/* <TabsContent
                  value="others"
                  className="space-y-2 pt-4 w-[500px]"
                >
                  <Input
                    type="email"
                    placeholder="General Notification Email"
                    value={brevoEmails.notificationEmail}
                    onChange={(e) =>
                      handleEmailChange("notificationEmail", e.target.value)
                    }
                    onBlur={(e) =>
                      handleEmailChange("notificationEmail", e.target.value)
                    }
                  />
                  {emailErrors.notificationEmail && (
                    <p className="text-red-500 text-sm">
                      {emailErrors.notificationEmail}
                    </p>
                  )}
                </TabsContent>
                <TabsContent
                  value="others"
                  className="space-y-2 pt-4 w-[500px]"
                >
                  <Input
                    type="email"
                    placeholder="General Notification Email"
                    value={brevoEmails.notificationEmail}
                    onChange={(e) =>
                      handleEmailChange("notificationEmail", e.target.value)
                    }
                    onBlur={(e) =>
                      handleEmailChange("notificationEmail", e.target.value)
                    }
                  />
                  {emailErrors.notificationEmail && (
                    <p className="text-red-500 text-sm">
                      {emailErrors.notificationEmail}
                    </p>
                  )}
                </TabsContent> */}
              </Tabs>
              <Button
                onClick={handleBrevoUpdate}
                disabled={loading}
                className="mt-6 bg-green-600 hover:bg-green-500"
              >
                {loading ? "Saving..." : "Update Email Settings"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl w-[400px] space-y-4">
            <h2 className="text-lg font-semibold text-red-600">
              Re-login Required
            </h2>
            <p className="text-sm text-gray-700">
              You’ve changed your admin email or password. For security, you’ll
              be logged out and need to sign in again.
            </p>
            <div className="flex justify-end gap-2">
              {/* <Button
                variant="outline"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </Button> */}
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={signOutHandler}
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsPage;
