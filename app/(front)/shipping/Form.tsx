"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";

import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import useCartService from "@/lib/hooks/useCartStore";
import {
  ShippingAddress,
  PersonalInfo,
  BillingDetails,
  GstDetails,
} from "@/lib/models/OrderModel";
import SignInPopup from "@/components/signin/SignIn";
import { TextValidationHelper } from "../helpers/validationHelpers";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import { GuestLoaderOverlay } from "./loader";

type FormData = {
  personalInfo: PersonalInfo & { fullName?: string };
  shippingAddress: ShippingAddress;
  gstDetails: GstDetails;
  billingDetails: BillingDetails;
};

const Form = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [hasGST, setHasGST] = useState(false);
  const [isSignInPopupOpen, setIsSignInPopupOpen] = useState(false);
  const [prefillEmail, setPrefillEmail] = useState("");
  const [mounted, setMounted] = useState(false);
  const isEmailLocked = !!session?.user?.email;
  const isMobileLocked = !!session?.user?.mobileNumber;
  const isNameLocked = !!session?.user?.name;
  const [mode, setMode] = useState<"none" | "register" | "login" | "guest">(
    "none"
  );
  const [isUserJustRegistered, setIsUserJustRegistered] = useState(false);
  const [isGuestLoggingIn, setIsGuestLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loggedInUserType, setLoggedInUserType] = useState("");
  const [isGuestLoggedIn, setIsGuestLoggedIn] = useState("false");
  const getShippingStorageKey = () => {
    const mobile =
      session?.user?.mobileNumber || watch("personalInfo.mobileNumber");
    return `shippingAddress_${mobile}`;
  };

  const {
    saveShippingAddress,
    shippingAddress,
    savePersonalInfo,
    saveGSTDetails,
  } = useCartService();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      personalInfo: {
        email: "",
        mobileNumber: "",
        createAccountAfterCheckout: true,
      },
      shippingAddress: {
        firstName: "",
        lastName: "",
        address: "",
        landmark: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
      },
      gstDetails: { hasGST: false, companyName: "", gstNumber: "" },
      billingDetails: { sameAsShipping: true, country: "India" },
    },
  });

  useEffect(() => {
    setMounted(true);

    const key = getShippingStorageKey();
    const stored = localStorage.getItem(key);

    const source = shippingAddress || (stored ? JSON.parse(stored) : null);
    if (source) {
      Object.entries(source).forEach(([key, value]) => {
        setValue(`shippingAddress.${key as keyof ShippingAddress}`, value);
      });
    }
  }, [shippingAddress, session, setValue]);

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.shippingAddress) {
        const key = getShippingStorageKey();
        localStorage.setItem(key, JSON.stringify(value.shippingAddress));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, session]);

  useEffect(() => {
    const currentMobile =
      session?.user?.mobileNumber || watch("personalInfo.mobileNumber");
    const storageKeys = Object.keys(localStorage).filter((k) =>
      k.startsWith("shippingAddress_")
    );

    storageKeys.forEach((key) => {
      if (!key.endsWith(currentMobile || "")) {
        localStorage.removeItem(key); // remove others
      }
    });
  }, [session, watch("personalInfo.mobileNumber")]);

  useEffect(() => {
    if (session?.user) {
      if (session.user.email) {
        setValue("personalInfo.email", session.user.email);
      }
      if (session.user?.mobileNumber) {
        setValue("personalInfo.mobileNumber", session.user?.mobileNumber);
      }
      if (session.user.name) {
        setValue("personalInfo.fullName", session.user.name);
      }
    }
  }, [session, setValue]);

  useEffect(() => {
    if (sameAsShipping) {
      setValue("billingDetails", {
        ...watch("shippingAddress"),
        landmark: watch("shippingAddress.landmark") || "",
        sameAsShipping: true,
        country: "India",
      });
    }
  }, [sameAsShipping, setValue, watch]);

  const handleRegister = async () => {
    const formValues = watch();
    const { fullName, email, mobileNumber, password } = formValues.personalInfo;

    setIsRegistering(true); // Start loader

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Optional delay for smoother UX

      const res = await fetch("/api/checkout/create-user-or-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, mobileNumber, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // 🔴 Show specific server error (like mobile already exists)
        throw new Error(data.error || "Registration failed");
      }

      if (!data.newAccount) {
        toast.error("Account already exists. Please login.");
        setPrefillEmail(email);
        setIsSignInPopupOpen(true);
        return;
      }

      // ✅ Try logging in the new user
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        setIsUserJustRegistered(true);
        setMode("none");
      } else {
        throw new Error("Account created, but auto-login failed.");
      }
    } catch (error: any) {
      console.error("Registration error", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsRegistering(false); // Stop loader
    }
  };

  const handleRegisterGuest = async () => {
    setIsGuestLoggingIn(true); // ⬅️ Start loader

    try {
      const formValues = watch();
      const { fullName, email, mobileNumber } = formValues.personalInfo;
      const guestData = { fullName, email, mobileNumber };

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Optional delay for smoother UX

      sessionStorage.setItem("userType", "guest");
      sessionStorage.setItem("isGuestLoggedIn", "true");
      sessionStorage.setItem("guestUser", JSON.stringify(guestData));

      setLoggedInUserType("guest");
      setIsGuestLoggedIn("true");
      setMode("guest");

      setValue("personalInfo.fullName", fullName);
      setValue("personalInfo.email", email);
      setValue("personalInfo.mobileNumber", mobileNumber);

      savePersonalInfo(guestData);

      toast.success("Guest user logged in");
    } catch (error) {
      console.error("Guest login failed", error);
      toast.error("Failed to log in as guest. Please try again.");
    } finally {
      setIsGuestLoggingIn(false); // ⬅️ Stop loader no matter what
    }
  };

  const formSubmit: SubmitHandler<FormData> = async (form) => {
    try {
      if (session && isUserJustRegistered) {
        setPrefillEmail(form.personalInfo.email);
        setIsSignInPopupOpen(true);
        return;
      } else {
        // Normal login for existing users
        const result = await signIn("credentials", {
          email: form.personalInfo.email,
          password: form.personalInfo.password || "guestpassword",
          redirect: false,
        });

        if (!result?.ok) {
          alert("Login failed. Please try again manually.");
          return;
        }
      }

      // Save data
      savePersonalInfo({
        email: form.personalInfo.email,
        mobileNumber: form.personalInfo.mobileNumber,
      });
      saveGSTDetails({
        hasGST: form.gstDetails.hasGST ?? false,
        companyName: form.gstDetails.companyName || "",
        gstNumber: form.gstDetails.gstNumber || "",
        gstMobileNumber: form.gstDetails.gstMobileNumber || "",
        gstEmail: form.gstDetails.gstEmail || "",
      });
      saveShippingAddress(form.shippingAddress);
      localStorage.setItem(
        getShippingStorageKey(),
        JSON.stringify(form.shippingAddress)
      );
      if (!sameAsShipping) {
        saveShippingAddress(form.billingDetails);
      }

      router.push("/payment");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Something went wrong. Please try again.");
    }
  };

  type ModeType = "none" | "register" | "login" | "guest";

  useEffect(() => {
    const savedType = sessionStorage.getItem("userType");
    const isGuest = sessionStorage.getItem("isGuestLoggedIn");

    setLoggedInUserType(savedType || "");
    setIsGuestLoggedIn(isGuest || "false");

    if (
      savedType === "guest" ||
      savedType === "register" ||
      savedType === "login" ||
      savedType === "none"
    ) {
      setMode(savedType as ModeType);
    }

    if (savedType === "guest") {
      const guestData = JSON.parse(
        sessionStorage.getItem("guestUser") || "null"
      );
      if (guestData) {
        setValue("personalInfo.fullName", guestData.fullName);
        setValue("personalInfo.email", guestData.email);
        setValue("personalInfo.mobileNumber", guestData.mobileNumber);
      }
    }
  }, [setValue]);

  if (!mounted) {
    return (
      <div className="max-w-6xl mx-auto my-8 p-6 bg-white shadow-md rounded-lg animate-pulse space-y-6">
        <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto"></div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-300 rounded"></div>
          ))}
        </div>
        <div className="h-10 bg-gray-300 rounded w-1/2 mx-auto mt-8"></div>
      </div>
    );
  }

  return (
    <div>
      {isRegistering && (
        <GuestLoaderOverlay message="Registering your account..." />
      )}
      {isGuestLoggingIn && (
        <GuestLoaderOverlay message="Logging in as guest..." />
      )}

      <CheckoutSteps current={1} />
      {mode === "none" && !session && (
        <div className="mt-8 p-4">
          <div className="space-y-6 max-w-md mx-auto">
            {[
              {
                title: "New Customer",
                icon: <FaUserPlus className="text-green-500" />,
                description:
                  "Create an account to shop faster, track your orders, and view your order history.",
                btnText: "Register",
                btnClass: "bg-green-600 hover:bg-green-700 text-white",
                onClick: () => setMode("register"),
              },
              {
                title: "Returning Customer",
                icon: <FaSignInAlt className="text-pink-500" />,
                description: "Already have an account? Log in to continue.",
                btnText: "Login",
                btnClass:
                  "border border-pink-500 text-pink-600 hover:bg-pink-50",
                onClick: () => {
                  setMode("login");
                  setIsSignInPopupOpen(true);
                },
              },
              {
                title: "Guest Checkout",
                icon: "🛒",
                description:
                  "Continue as a guest if you don’t want to create an account.",
                btnText: "Continue as Guest",
                btnClass: "bg-gray-800 hover:bg-gray-900 text-white",
                onClick: () => setMode("guest"),
              },
            ].map(
              ({ title, icon, description, btnText, btnClass, onClick }) => (
                <div
                  key={title}
                  tabIndex={0}
                  role="button"
                  onClick={onClick}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onClick();
                  }}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm cursor-pointer transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <h3 className="font-semibold text-gray-900 flex items-center gap-3 text-lg mb-2 select-none">
                    {typeof icon === "string" ? (
                      <span className="text-2xl">{icon}</span>
                    ) : (
                      icon
                    )}
                    {title}
                  </h3>
                  <p className="text-gray-600 mb-4">{description}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent parent div onClick
                      onClick();
                    }}
                    className={`btn btn-sm px-5 py-2 rounded-md font-semibold transition-colors duration-300 ${btnClass}`}
                  >
                    {btnText}
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {(mode === "register" || mode === "guest") &&
        !session &&
        isGuestLoggedIn === "false" && (
          <div className=" mt-8 p-4">
            <div className="space-y-6 max-w-md mx-auto">
              <div>
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">
                    Personal Information
                    {loggedInUserType === "guest" && (
                      <span className="text-sm text-gray-500 ml-2">
                        (Logged in as Guest)
                      </span>
                    )}
                  </h2>
                  <div className="space-y-3">
                    <div className="space-y-3">
                      {/* Full Name */}
                      <div>
                        <label className="text-xs font-medium block mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          placeholder="Full Name"
                          disabled={isNameLocked}
                          {...register("personalInfo.fullName", {
                            required: "Full name is required",
                            validate: TextValidationHelper.createNameValidator(
                              3,
                              30
                            ),
                          })}
                          onBlur={(e) => {
                            const cleaned = TextValidationHelper.sanitizeText(
                              e.target.value
                            );
                            setValue("personalInfo.fullName", cleaned, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }}
                          className={`input input-bordered w-full text-sm ${isNameLocked ? "bg-gray-100" : ""}`}
                        />
                        {errors.personalInfo?.fullName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.personalInfo.fullName.message}
                          </p>
                        )}
                      </div>

                      {/* Mobile Number */}
                      <div>
                        <label className="text-xs font-medium block mb-1">
                          Mobile Number
                        </label>
                        <div className="flex items-center border rounded-md input input-bordered w-full overflow-hidden">
                          <span className="px-3 text-gray-600 text-sm">
                            +91
                          </span>
                          <input
                            type="text"
                            maxLength={10}
                            placeholder="Enter 10 digit number"
                            disabled={isMobileLocked}
                            {...register("personalInfo.mobileNumber", {
                              required: "Mobile number is required",
                              pattern: {
                                value: /^[6-9]\d{9}$/,
                                message:
                                  "Enter valid 10 digit Indian mobile number",
                              },
                            })}
                            className={`w-full px-2 py-2 outline-none text-sm ${isMobileLocked ? "bg-gray-100" : ""}`}
                            inputMode="numeric"
                          />
                        </div>
                        {errors.personalInfo?.mobileNumber && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.personalInfo.mobileNumber.message}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="text-xs font-medium block mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="Email Address"
                          disabled={isEmailLocked}
                          {...register("personalInfo.email", {
                            required: "Email is required",
                          })}
                          className={`input input-bordered w-full text-sm ${isEmailLocked ? "bg-gray-100" : ""}`}
                        />
                        {errors.personalInfo?.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.personalInfo.email.message}
                          </p>
                        )}
                      </div>

                      {/* Password (only if user not logged in and not guest) */}
                      {!session && mode !== "guest" && (
                        <div>
                          <label className="text-xs font-medium block mb-1">
                            Create Password
                          </label>
                          <input
                            type="password"
                            placeholder="Password"
                            {...register("personalInfo.password", {
                              required: "Password is required",
                            })}
                            className="input input-bordered w-full text-sm"
                          />
                          {errors.personalInfo?.password && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.personalInfo.password.message}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Guest Continue Submit Button */}
                      {mode === "guest" && isGuestLoggedIn === "false" && (
                        <button
                          type="button"
                          onClick={handleRegisterGuest}
                          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                        >
                          Continue as Guest
                        </button>
                      )}

                      {/* Register Button */}
                      {mode === "register" && (
                        <button
                          type="button"
                          onClick={handleRegister}
                          className="w-full py-2 px-4 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition"
                        >
                          Register
                        </button>
                      )}

                      {/* Back button */}
                      {(mode === "register" ||
                        !session ||
                        (mode === "guest" && isGuestLoggedIn === "false")) && (
                        <button
                          onClick={() => setMode("none")}
                          className="text-xs text-gray-500 underline mt-4 block mx-auto"
                          type="button"
                        >
                          ← Go back
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {(session ||
        (isGuestLoggedIn === "true" && loggedInUserType === "guest")) && (
        <div
          className={`${
            session || loggedInUserType === "guest"
              ? "max-w-6xl bg-white shadow-md rounded-lg relative mx-auto"
              : "max-w-md mx-auto"
          } my-8 p-6`}
        >
          <form
            onSubmit={handleSubmit(formSubmit)}
            className={`${
              session || loggedInUserType === "guest"
                ? "" // Updated to handle grid layout for mobile and desktop
                : "space-y-6"
            }`}
          >
            {/* Left - Personal Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                {session || mode === "register" || mode === "guest" ? (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">
                      Personal Information
                      {loggedInUserType === "guest" && (
                        <span className="text-sm text-gray-500 ml-2">
                          (Logged in as Guest)
                        </span>
                      )}
                    </h2>
                    <div className="space-y-3">
                      <div className="space-y-3">
                        {/* Full Name */}
                        <div>
                          <label className="text-xs font-medium block mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            placeholder="Full Name"
                            disabled={isNameLocked}
                            {...register("personalInfo.fullName", {
                              required: "Full name is required",
                              validate:
                                TextValidationHelper.createNameValidator(3, 30),
                            })}
                            onBlur={(e) => {
                              const cleaned = TextValidationHelper.sanitizeText(
                                e.target.value
                              );
                              setValue("personalInfo.fullName", cleaned, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            }}
                            className={`input input-bordered w-full text-sm ${isNameLocked ? "bg-gray-100" : ""}`}
                          />
                          {errors.personalInfo?.fullName && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.personalInfo.fullName.message}
                            </p>
                          )}
                        </div>

                        {/* Mobile Number */}
                        <div>
                          <label className="text-xs font-medium block mb-1">
                            Mobile Number
                          </label>
                          <div className="flex items-center border rounded-md input input-bordered w-full overflow-hidden">
                            <span className="px-3 text-gray-600 text-sm">
                              +91
                            </span>
                            <input
                              type="text"
                              maxLength={10}
                              placeholder="Enter 10 digit number"
                              disabled={isMobileLocked}
                              {...register("personalInfo.mobileNumber", {
                                required: "Mobile number is required",
                                pattern: {
                                  value: /^[6-9]\d{9}$/,
                                  message:
                                    "Enter valid 10 digit Indian mobile number",
                                },
                              })}
                              className={`w-full px-2 py-2 outline-none text-sm ${isMobileLocked ? "bg-gray-100" : ""}`}
                              inputMode="numeric"
                            />
                          </div>
                          {errors.personalInfo?.mobileNumber && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.personalInfo.mobileNumber.message}
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label className="text-xs font-medium block mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            placeholder="Email Address"
                            disabled={isEmailLocked}
                            {...register("personalInfo.email", {
                              required: "Email is required",
                            })}
                            className={`input input-bordered w-full text-sm ${isEmailLocked ? "bg-gray-100" : ""}`}
                          />
                          {errors.personalInfo?.email && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.personalInfo.email.message}
                            </p>
                          )}
                        </div>

                        {/* Password (only if user not logged in and not guest) */}
                        {!session && mode !== "guest" && (
                          <div>
                            <label className="text-xs font-medium block mb-1">
                              Create Password
                            </label>
                            <input
                              type="password"
                              placeholder="Password"
                              {...register("personalInfo.password", {
                                required: "Password is required",
                              })}
                              className="input input-bordered w-full text-sm"
                            />
                            {errors.personalInfo?.password && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.personalInfo.password.message}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Guest Continue Submit Button */}
                        {mode === "guest" && isGuestLoggedIn === "false" && (
                          <button
                            type="button"
                            onClick={handleRegisterGuest}
                            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                          >
                            Continue as Guest
                          </button>
                        )}

                        {/* Register Button */}
                        {mode === "register" && (
                          <button
                            type="button"
                            onClick={handleRegister}
                            className="w-full py-2 px-4 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition"
                          >
                            Register
                          </button>
                        )}

                        {/* Back button */}
                        {(mode === "register" ||
                          mode === "login" ||
                          session ||
                          (mode === "guest" &&
                            isGuestLoggedIn === "false")) && (
                          <button
                            onClick={() => setMode("none")}
                            className="text-xs text-gray-500 underline mt-4 block mx-auto"
                            type="button"
                          >
                            ← Go back
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div>
                {(session ||
                  (loggedInUserType === "guest" &&
                    isGuestLoggedIn === "true")) && (
                  <>
                    {/* Right - Shipping Address */}
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold">
                        Shipping Address
                      </h2>

                      <div>
                        <label className="text-xs font-medium">
                          Full Address
                        </label>
                        <textarea
                          placeholder="Full Address"
                          {...register("shippingAddress.address", {
                            required: true,
                          })}
                          className="textarea textarea-bordered w-full text-sm"
                          rows={3}
                        />

                        {errors.shippingAddress?.address && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.shippingAddress.address.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-medium">Landmark</label>
                        <input
                          type="text"
                          placeholder="Landmark (Optional)"
                          maxLength={30}
                          {...register("shippingAddress.landmark", {
                            validate:
                              TextValidationHelper.createLandmarkValidator(),
                          })}
                          className={`input input-bordered w-full text-sm ${
                            errors.shippingAddress?.landmark
                              ? "border-red-500"
                              : ""
                          }`}
                        />

                        {errors.shippingAddress?.landmark && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.shippingAddress.landmark.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-medium">City</label>
                          <input
                            type="text"
                            placeholder="City"
                            {...register("shippingAddress.city", {
                              validate:
                                TextValidationHelper.createCityValidator(2, 50),
                            })}
                            className="input input-bordered w-full text-sm"
                          />

                          {errors.shippingAddress?.city && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.shippingAddress.city.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="text-xs font-medium">State</label>
                          <select
                            {...register("shippingAddress.state", {
                              required: true,
                            })}
                            className="select select-bordered w-full text-sm"
                          >
                            <option value="">Select</option>
                            <option value="Andhra Pradesh">
                              Andhra Pradesh
                            </option>
                            <option value="Arunachal Pradesh">
                              Arunachal Pradesh
                            </option>
                            <option value="Assam">Assam</option>
                            <option value="Bihar">Bihar</option>
                            <option value="Chhattisgarh">Chhattisgarh</option>
                            <option value="Goa">Goa</option>
                            <option value="Gujarat">Gujarat</option>
                            <option value="Haryana">Haryana</option>
                            <option value="Himachal Pradesh">
                              Himachal Pradesh
                            </option>
                            <option value="Jharkhand">Jharkhand</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Kerala">Kerala</option>
                            <option value="Madhya Pradesh">
                              Madhya Pradesh
                            </option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Manipur">Manipur</option>
                            <option value="Meghalaya">Meghalaya</option>
                            <option value="Mizoram">Mizoram</option>
                            <option value="Nagaland">Nagaland</option>
                            <option value="Odisha">Odisha</option>
                            <option value="Punjab">Punjab</option>
                            <option value="Rajasthan">Rajasthan</option>
                            <option value="Sikkim">Sikkim</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="Telangana">Telangana</option>
                            <option value="Tripura">Tripura</option>
                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                            <option value="Uttarakhand">Uttarakhand</option>
                            <option value="West Bengal">West Bengal</option>
                            <option value="Andaman and Nicobar Islands">
                              Andaman and Nicobar Islands
                            </option>
                            <option value="Chandigarh">Chandigarh</option>
                            <option value="Dadra and Nagar Haveli and Daman and Diu">
                              Dadra and Nagar Haveli and Daman and Diu
                            </option>
                            <option value="Delhi">Delhi</option>
                            <option value="Jammu and Kashmir">
                              Jammu and Kashmir
                            </option>
                            <option value="Ladakh">Ladakh</option>
                            <option value="Lakshadweep">Lakshadweep</option>
                            <option value="Puducherry">Puducherry</option>
                          </select>

                          {/* add all Indian states if needed */}
                        </div>

                        <div>
                          <label className="text-xs font-medium">
                            Postal Code
                          </label>
                          {/* <input
                  type="text"
                  placeholder="Postal Code"
                  {...register("shippingAddress.postalCode", {
                    required: true,
                  })}
                  className="input input-bordered w-full text-sm"
                /> */}

                          <input
                            type="text"
                            placeholder="Postal Code"
                            {...register("shippingAddress.postalCode", {
                              required: "Postal code is required",
                              validate:
                                TextValidationHelper.createPostalCodeValidator(),
                            })}
                            className={`input input-bordered w-full text-sm ${
                              errors.shippingAddress?.postalCode
                                ? "border-red-500"
                                : ""
                            }`}
                          />

                          {errors.shippingAddress?.postalCode && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.shippingAddress.postalCode.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium">Country</label>
                        <div className="flex items-center gap-2">
                          <svg
                            width="24"
                            height="16"
                            viewBox="0 0 640 480"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-label="India Flag"
                            role="img"
                            className="inline-block"
                          >
                            <rect width="640" height="160" fill="#FF9933" />
                            <rect
                              y="160"
                              width="640"
                              height="160"
                              fill="#FFFFFF"
                            />
                            <rect
                              y="320"
                              width="640"
                              height="160"
                              fill="#138808"
                            />
                            <circle
                              cx="320"
                              cy="240"
                              r="60"
                              fill="none"
                              stroke="#000088"
                              strokeWidth="10"
                            />
                            {/* Ashoka Chakra spokes */}
                            {[...Array(24)].map((_, i) => {
                              const angle = i * 15 * (Math.PI / 180);
                              return (
                                <line
                                  key={i}
                                  x1={320}
                                  y1={240}
                                  x2={320 + 60 * Math.cos(angle)}
                                  y2={240 + 60 * Math.sin(angle)}
                                  stroke="#000088"
                                  strokeWidth="2"
                                />
                              );
                            })}
                          </svg>

                          <input
                            type="text"
                            value="India"
                            readOnly
                            {...register("shippingAddress.country")}
                            className="input input-bordered w-full text-sm bg-gray-100"
                          />
                        </div>
                      </div>
                      {/* Email and Mobile Number fields */}
                      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  {...register("shippingAddress.email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  className={`input input-bordered w-full text-sm ${
                    errors.shippingAddress?.email ? "border-red-500" : ""
                  }`}
                />
                {errors.shippingAddress?.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.shippingAddress.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  maxLength={10}
                  {...register("shippingAddress.mobileNumber", {
                    required: "Mobile number is required",
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Invalid Indian mobile number",
                    },
                  })}
                  className={`input input-bordered w-full text-sm ${
                    errors.shippingAddress?.mobileNumber ? "border-red-500" : ""
                  }`}
                />
                {errors.shippingAddress?.mobileNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.shippingAddress.mobileNumber.message}
                  </p>
                )}
              </div>
            </div> */}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="col-span-2 mt-6">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="checkbox checkbox-sm"
                  />
                  <span>Billing address same as shipping address</span>
                </label>
              </div>

              {!sameAsShipping && (
                <div className="space-y-4 col-span-2 mt-4">
                  <h2 className="text-lg font-semibold">Billing Address</h2>

                  <div>
                    <label className="text-xs font-medium">Full Address</label>
                    <textarea
                      placeholder="Billing Address"
                      {...register("billingDetails.address", {
                        required: true,
                      })}
                      className="textarea textarea-bordered w-full text-sm"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-medium">City</label>
                      {/* <input
                    type="text"
                    placeholder="City"
                    {...register("billingDetails.city", { required: true })}
                    className="input input-bordered w-full text-sm"
                  /> */}

                      <input
                        type="text"
                        placeholder="City"
                        {...register("billingDetails.city", {
                          validate: TextValidationHelper.createCityValidator(
                            2,
                            50
                          ),
                        })}
                        className="input input-bordered w-full text-sm"
                      />

                      {errors.billingDetails?.city && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.billingDetails.city.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-medium">State</label>
                      {/* <input
                    type="text"
                    placeholder="State"
                    {...register("billingDetails.state", { required: true })}
                    className="input input-bordered w-full text-sm"
                  /> */}

                      <select
                        {...register("billingDetails.state", {
                          required: true,
                        })}
                        className="select select-bordered w-full text-sm"
                      >
                        <option value="">Select</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">
                          Arunachal Pradesh
                        </option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">
                          Himachal Pradesh
                        </option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Andaman and Nicobar Islands">
                          Andaman and Nicobar Islands
                        </option>
                        <option value="Chandigarh">Chandigarh</option>
                        <option value="Dadra and Nagar Haveli and Daman and Diu">
                          Dadra and Nagar Haveli and Daman and Diu
                        </option>
                        <option value="Delhi">Delhi</option>
                        <option value="Jammu and Kashmir">
                          Jammu and Kashmir
                        </option>
                        <option value="Ladakh">Ladakh</option>
                        <option value="Lakshadweep">Lakshadweep</option>
                        <option value="Puducherry">Puducherry</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium">Postal Code</label>
                      {/* <input
                    type="text"
                    placeholder="Postal Code"
                    {...register("billingDetails.postalCode", {
                      required: true,
                    })}
                    className="input input-bordered w-full text-sm"
                  /> */}

                      <input
                        type="text"
                        placeholder="Postal Code"
                        {...register("billingDetails.postalCode", {
                          required: "Postal code is required",
                          validate:
                            TextValidationHelper.createPostalCodeValidator(),
                        })}
                        className={`input input-bordered w-full text-sm ${
                          errors.billingDetails?.postalCode
                            ? "border-red-500"
                            : ""
                        }`}
                      />

                      {errors.billingDetails?.postalCode && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.billingDetails.postalCode.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium">Country</label>
                    <input
                      type="text"
                      placeholder="Country"
                      readOnly
                      {...register("billingDetails.country", {
                        required: true,
                      })}
                      className="input input-bordered w-full text-sm bg-gray-100"
                    />
                  </div>
                </div>
              )}
              {/* GST Details */}
              <div className="space-y-4 col-span-2 mt-4">
                <h2 className="text-lg font-semibold">GST Details</h2>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={hasGST}
                    onChange={(e) => {
                      setHasGST(e.target.checked);
                      setValue("gstDetails.hasGST", e.target.checked);
                    }}
                    className="checkbox checkbox-sm"
                  />
                  <label className="text-xs font-medium">
                    Do you have GST?
                  </label>
                </div>

                {hasGST && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-medium">
                        Company Name
                      </label>
                      <input
                        type="text"
                        placeholder="Company Name"
                        {...register("gstDetails.companyName")}
                        className="input input-bordered w-full text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium">GST Number</label>
                      <input
                        type="text"
                        placeholder="GST Number"
                        {...register("gstDetails.gstNumber", {
                          validate: TextValidationHelper.validateGSTIN,
                        })}
                        className="input input-bordered w-full text-sm"
                      />
                      {errors.gstDetails?.gstNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.gstDetails.gstNumber.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-medium">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        placeholder="GST Mobile Number"
                        maxLength={10}
                        {...register("gstDetails.gstMobileNumber", {
                          pattern: {
                            value: /^[6-9]\d{9}$/,
                            message:
                              "Enter valid 10 digit Indian mobile number",
                          },
                        })}
                        className="input input-bordered w-full text-sm"
                        inputMode="numeric"
                      />
                      {errors.gstDetails?.gstMobileNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.gstDetails.gstMobileNumber.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-medium">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="GST Email"
                        {...register("gstDetails.gstEmail", {
                          pattern: {
                            value:
                              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Enter a valid email address",
                          },
                        })}
                        className="input input-bordered w-full text-sm"
                      />
                      {errors.gstDetails?.gstEmail && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.gstDetails.gstEmail.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {/* Ensure the button spans full width */}
                <div className="col-span-full sm:col-span-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn w-full mt-4 bg-gradient-to-r from-pink-500 to-red-500 text-white text-sm"
                  >
                    {isSubmitting ? "Saving..." : "Next"}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Optional Illustration */}
          <div className="hidden md:block absolute bottom-4 right-6 opacity-20 w-36">
            {/* You can add your SVG here */}
            {/* <Image src="/shipping-illustration.svg" width={150} height={150} alt="Shipping" /> */}
          </div>
        </div>
      )}
      {mode === "login" && !session && (
        <SignInPopup
          isOpen={isSignInPopupOpen}
          setIsOpen={setIsSignInPopupOpen}
          prefillEmail={prefillEmail}
        />
      )}

      {/* <SignInPopup
        isOpen={isSignInPopupOpen}
        setIsOpen={setIsSignInPopupOpen}
        prefillEmail={prefillEmail}
        message="An account with this email already exists. Please log in to continue."
      /> */}
    </div>
  );
};

export default Form;
