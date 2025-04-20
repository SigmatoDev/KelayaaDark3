"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";

import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import useCartService from "@/lib/hooks/useCartStore";
import { ShippingAddress, PersonalInfo, BillingDetails, GstDetails } from "@/lib/models/OrderModel";
import SignInPopup from "@/components/signin/SignIn";

type FormData = {
  personalInfo: PersonalInfo;
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

  const { saveShippingAddress, shippingAddress, savePersonalInfo, saveGSTDetails } = useCartService();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      personalInfo: { email: "", mobileNumber: "", createAccountAfterCheckout: true },
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
      billingDetails: { sameAsShipping: true },
    },
  });

  useEffect(() => {
    setMounted(true);
    if (shippingAddress) {
      Object.entries(shippingAddress).forEach(([key, value]) => {
        setValue(`shippingAddress.${key as keyof ShippingAddress}`, value);
      });
    }
  }, [shippingAddress, setValue]);

  useEffect(() => {
    if (sameAsShipping) {
      setValue("billingDetails", { ...watch("shippingAddress"), sameAsShipping: true });
    }
  }, [sameAsShipping, setValue, watch]);

  const formSubmit: SubmitHandler<FormData> = async (form) => {
    try {
      if (!session) {
        const res = await fetch("/api/checkout/create-user-or-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.personalInfo.email,
            mobileNumber: form.personalInfo.mobileNumber,
            password: form.personalInfo.password,
          }),
        });

        const { success, newAccount } = await res.json();
        if (!success) throw new Error("Failed to create or check user.");

        if (!newAccount) {
          setPrefillEmail(form.personalInfo.email);
          setIsSignInPopupOpen(true);
          return;
        } else {
          await signIn("credentials", {
            email: form.personalInfo.email,
            password: form.personalInfo.password || "guestpassword",
            redirect: false,
          });
        }
      }

      savePersonalInfo({
        email: form.personalInfo.email,
        mobileNumber: form.personalInfo.mobileNumber,
      });
      saveGSTDetails({
        hasGST: form.gstDetails.hasGST ?? false,
        companyName: form.gstDetails.companyName || "",
        gstNumber: form.gstDetails.gstNumber || "",
      });
      saveShippingAddress(form.shippingAddress);
      router.push("/payment");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Something went wrong. Please try again.");
    }
  };

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
      <CheckoutSteps current={1} />
      <div className="max-w-6xl mx-auto my-8 p-6 bg-white shadow-md rounded-lg relative">
        <form onSubmit={handleSubmit(formSubmit)} className="grid md:grid-cols-2 gap-6">
          {/* Left - Personal Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium">Mobile Number</label>
                <div className="space-y-1">
  <div className="flex items-center border rounded-md input input-bordered w-full overflow-hidden">
    <span className="px-3 text-gray-600 text-sm">+91</span>
    <input
      type="text"
      maxLength={10}
      placeholder="Enter 10 digit number"
      {...register("personalInfo.mobileNumber", {
        required: "Mobile number is required",
        pattern: {
          value: /^[6-9]\d{9}$/,
          message: "Enter valid 10 digit Indian mobile number",
        },
      })}
      className="w-full px-2 py-2 outline-none text-sm"
      inputMode="numeric"
    />
  </div>
  {errors.personalInfo?.mobileNumber && (
    <p className="text-red-500 text-xs mt-1">
      {errors.personalInfo.mobileNumber.message}
    </p>
  )}
</div>

              </div>

              <div>
                <label className="text-xs font-medium">Email</label>
                <input
                  type="email"
                  placeholder="Email Address"
                  {...register("personalInfo.email", { required: true })}
                  className="input input-bordered w-full text-sm"
                />
              </div>

              {!session && (
                <div>
                  <label className="text-xs font-medium">Create Password</label>
                  <input
                    type="password"
                    placeholder="Password"
                    {...register("personalInfo.password", { required: true })}
                    className="input input-bordered w-full text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right - Shipping Address */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Shipping Address</h2>

            <div>
              <label className="text-xs font-medium">Full Address</label>
              <textarea
                placeholder="Full Address"
                {...register("shippingAddress.address", { required: true })}
                className="textarea textarea-bordered w-full text-sm"
                rows={3}
              />
            </div>

            <div>
              <label className="text-xs font-medium">Landmark</label>
              <input
                type="text"
                placeholder="Landmark (Optional)"
                {...register("shippingAddress.landmark")}
                className="input input-bordered w-full text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium">City</label>
                <input
                  type="text"
                  placeholder="City"
                  {...register("shippingAddress.city", { required: true })}
                  className="input input-bordered w-full text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium">State</label>
                <select
                  {...register("shippingAddress.state", { required: true })}
                  className="select select-bordered w-full text-sm"
                >
                  <option value="">Select</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Delhi">Delhi</option>
                  {/* add all Indian states if needed */}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium">Postal Code</label>
                <input
                  type="text"
                  placeholder="Postal Code"
                  {...register("shippingAddress.postalCode", { required: true })}
                  className="input input-bordered w-full text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium">Country</label>
              <input
                value="India"
                readOnly
                {...register("shippingAddress.country")}
                className="input input-bordered w-full text-sm bg-gray-100"
              />
            </div>
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn w-full mt-4 bg-gradient-to-r from-pink-500 to-red-500 text-white text-sm"
            >
              {isSubmitting ? "Saving..." : "Next"}
            </button>
          </div>
        </form>

        {/* Optional Illustration */}
        <div className="hidden md:block absolute bottom-4 right-6 opacity-20 w-36">
          {/* You can add your SVG here */}
          {/* <Image src="/shipping-illustration.svg" width={150} height={150} alt="Shipping" /> */}
        </div>
      </div>

      <SignInPopup
        isOpen={isSignInPopupOpen}
        setIsOpen={setIsSignInPopupOpen}
        prefillEmail={prefillEmail}
        message="An account with this email already exists. Please log in to continue."
      />
    </div>
  );
};

export default Form;
