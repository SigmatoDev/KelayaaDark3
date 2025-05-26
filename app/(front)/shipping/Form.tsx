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
    mode: 'onChange', 
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
      });
    }
  }, [sameAsShipping, setValue, watch]);

  const formSubmit: SubmitHandler<FormData> = async (form) => {
    try {
      if (!session) {
        const res = await fetch("/api/checkout/create-user-or-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: form.personalInfo.fullName,
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
          const result = await signIn("credentials", {
            email: form.personalInfo.email,
            password: form.personalInfo.password || "guestpassword",
            redirect: false,
          });

          if (result?.ok) {
            // window.location.reload(); // ✅ force page reload after login
          } else {
            alert("Login failed. Please try again manually.");
          }
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

      if (!sameAsShipping) {
        saveShippingAddress(form.billingDetails); // <-- billing details if user entered different one
      }

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
        <form
          onSubmit={handleSubmit(formSubmit)}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Left - Personal Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium">Full Name</label>
                {/* <input
                  type="text"
                  placeholder="Full Name"
                  disabled={isNameLocked}
                  {...register("personalInfo.fullName", { required: true })}
                  className={`input input-bordered w-full text-sm ${isNameLocked ? "bg-gray-100" : ""}`}
                /> */}



                <input
                  type="text"
                  placeholder="Full Name"
                  disabled={isNameLocked}
                  {...register('personalInfo.fullName', {
                    required: 'Full name is required',
                    validate: TextValidationHelper.createNameValidator(3, 30),
                  })}
                  onBlur={(e) => {
                    const cleaned = TextValidationHelper.sanitizeText(e.target.value);
                    setValue('personalInfo.fullName', cleaned, {
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

              <div className="flex items-center border rounded-md input input-bordered w-full overflow-hidden">
                <span className="px-3 text-gray-600 text-sm">+91</span>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="Enter 10 digit number"
                  disabled={isMobileLocked}
                  {...register("personalInfo.mobileNumber", {
                    required: "Mobile number is required",
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Enter valid 10 digit Indian mobile number",
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

              <input
                type="email"
                placeholder="Email Address"
                disabled={isEmailLocked}
                {...register("personalInfo.email", { required: true })}
                className={`input input-bordered w-full text-sm ${isEmailLocked ? "bg-gray-100" : ""}`}
              />

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
    validate: TextValidationHelper.createLandmarkValidator(),
  })}
  className={`input input-bordered w-full text-sm ${
    errors.shippingAddress?.landmark ? "border-red-500" : ""
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
  {...register('shippingAddress.city', {
    validate: TextValidationHelper.createCityValidator(2, 50)
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
                  {...register("shippingAddress.state", { required: true })}
                  className="select select-bordered w-full text-sm"
                >
                
  <option value="">Select</option>
  <option value="Andhra Pradesh">Andhra Pradesh</option>
  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
  <option value="Assam">Assam</option>
  <option value="Bihar">Bihar</option>
  <option value="Chhattisgarh">Chhattisgarh</option>
  <option value="Goa">Goa</option>
  <option value="Gujarat">Gujarat</option>
  <option value="Haryana">Haryana</option>
  <option value="Himachal Pradesh">Himachal Pradesh</option>
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
  <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
  <option value="Chandigarh">Chandigarh</option>
  <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
  <option value="Delhi">Delhi</option>
  <option value="Jammu and Kashmir">Jammu and Kashmir</option>
  <option value="Ladakh">Ladakh</option>
  <option value="Lakshadweep">Lakshadweep</option>
  <option value="Puducherry">Puducherry</option>
</select>

                  {/* add all Indian states if needed */}
              
              </div>

              <div>
                <label className="text-xs font-medium">Postal Code</label>
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
    validate: TextValidationHelper.createPostalCodeValidator(),
  })}
  className={`input input-bordered w-full text-sm ${
    errors.shippingAddress?.postalCode ? 'border-red-500' : ''
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
              <input
                value="India"
                readOnly
                {...register("shippingAddress.country")}
                className="input input-bordered w-full text-sm bg-gray-100"
              />
            </div>
          </div>

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
                  {...register("billingDetails.address", { required: true })}
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
                  {...register('billingDetails.city', {
                    validate: TextValidationHelper.createCityValidator(2, 50)
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
                  {...register("billingDetails.state", { required: true })}
                  className="select select-bordered w-full text-sm"
                >
                
  <option value="">Select</option>
  <option value="Andhra Pradesh">Andhra Pradesh</option>
  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
  <option value="Assam">Assam</option>
  <option value="Bihar">Bihar</option>
  <option value="Chhattisgarh">Chhattisgarh</option>
  <option value="Goa">Goa</option>
  <option value="Gujarat">Gujarat</option>
  <option value="Haryana">Haryana</option>
  <option value="Himachal Pradesh">Himachal Pradesh</option>
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
  <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
  <option value="Chandigarh">Chandigarh</option>
  <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
  <option value="Delhi">Delhi</option>
  <option value="Jammu and Kashmir">Jammu and Kashmir</option>
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
                  validate: TextValidationHelper.createPostalCodeValidator(),
                })}
                className={`input input-bordered w-full text-sm ${
                  errors.billingDetails?.postalCode ? 'border-red-500' : ''
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
                  value="India"
                  readOnly
                  {...register("billingDetails.country", { required: true })}
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
              <label className="text-xs font-medium">Do you have GST?</label>
            </div>

            {hasGST && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium">Company Name</label>
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
                {errors.gstDetails?.gstNumber.message}
              </p>
            )}


                </div>
              </div>
            )}
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
