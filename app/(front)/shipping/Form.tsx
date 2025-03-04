"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import useCartService from "@/lib/hooks/useCartStore";
import {
  ShippingAddress,
  PersonalInfo,
  BillingDetails,
  GstDetails,
} from "@/lib/models/OrderModel";
import {
  FaCheckCircle,
  FaPercentage,
  FaShoppingBag,
  FaTag,
  FaTruck,
} from "react-icons/fa";

type FormData = {
  personalInfo: PersonalInfo;
  shippingAddress: ShippingAddress;
  gstDetails: GstDetails;
  billingDetails: BillingDetails;
};

const Form = () => {
  const router = useRouter();
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [hasGST, setHasGST] = useState(false);
  const {
    items,
    itemsPrice,
    couponCode,
    couponDiscount,
    discountPrice,
    saveShippingAddress,
    shippingAddress,
    totalPrice,
    taxPrice,
  } = useCartService();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      personalInfo: {
        email: "",
        mobileNumber: "",
        createAccountAfterCheckout: false,
      },
      shippingAddress: shippingAddress || {
        firstName: "",
        lastName: "",
        streetAddress1: "",
        streetAddress2: "",
        streetAddress3: "",
        country: "",
        state: "",
        city: "",
        postalCode: "",
      },
      gstDetails: {
        hasGST: false,
        companyName: "",
        gstNumber: "",
      },
      billingDetails: {
        sameAsShipping: true,
        firstName: "",
        lastName: "",
        streetAddress1: "",
        streetAddress2: "",
        streetAddress3: "",
        country: "",
        state: "",
        city: "",
        postalCode: "",
      },
    },
  });

  useEffect(() => {
    if (shippingAddress) {
      Object.entries(shippingAddress).forEach(([key, value]) => {
        setValue(`shippingAddress.${key as keyof ShippingAddress}`, value);
      });
    }
  }, [setValue, shippingAddress]);

  useEffect(() => {
    if (sameAsShipping) {
      setValue("billingDetails", {
        ...watch("shippingAddress"),
        sameAsShipping: true,
      });
    }
  }, [sameAsShipping, setValue, watch]);

  const formSubmit: SubmitHandler<FormData> = async (form) => {
    saveShippingAddress(form.shippingAddress);
    router.push("/payment");
  };

  return (
    <div>
      <CheckoutSteps current={1} />
      <div className="grid grid-cols-12 gap-6 my-4">
        <div className="col-span-7 bg-white p-6 shadow-md rounded-lg">
          <h1 className="text-xl font-bold">Checkout Information</h1>
          <form onSubmit={handleSubmit(formSubmit)}>
            {/* Personal Information */}
            <h2 className="text-lg font-semibold mt-4">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Email"
                {...register("personalInfo.email", { required: true })}
                className="input input-bordered w-full"
              />
              <input
                type="text"
                placeholder="Mobile Number"
                {...register("personalInfo.mobileNumber", { required: true })}
                className="input input-bordered w-full"
              />
            </div>

            {/* Shipping Address */}
            <h2 className="text-lg font-semibold mt-4">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(watch("shippingAddress")).map((key) => (
                <input
                  key={key}
                  type="text"
                  placeholder={key}
                  {...register(`shippingAddress.${key}` as any, {
                    required: true,
                  })}
                  className="input input-bordered w-full"
                />
              ))}
            </div>

            {/* GST Details */}
            <h2 className="text-lg font-semibold mt-4 text-black">
              GST Details
            </h2>
            <label className="flex items-center cursor-pointer">
              <span className="mr-2">Do you have GST?</span>
              <div
                className={`relative w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
                  hasGST ? "bg-pink-500" : "bg-gray-300"
                }`}
                onClick={() => setHasGST(!hasGST)}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                    hasGST ? "translate-x-6" : "translate-x-0"
                  }`}
                ></div>
              </div>
            </label>

            {hasGST && (
              <div className="grid grid-cols-2 gap-4 mt-3">
                <input
                  type="text"
                  placeholder="Company Name"
                  {...register("gstDetails.companyName", { required: hasGST })}
                  className="input input-bordered w-full"
                />
                <input
                  type="text"
                  placeholder="GST Number"
                  {...register("gstDetails.gstNumber", { required: hasGST })}
                  className="input input-bordered w-full"
                />
              </div>
            )}

            {/* Billing Address */}
            <h2 className="text-lg font-semibold mt-4 text-black">
              Billing Address
            </h2>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={sameAsShipping}
                onChange={() => setSameAsShipping(!sameAsShipping)}
                className="w-5 h-5 bg-white border border-gray-500 appearance-none checked:bg-pink-500 checked:border-pink-700 checked:after:content-['✔'] checked:after:text-white checked:after:block checked:after:text-center checked:after:font-bold checked:after:leading-5"
              />
              <span className="ml-2">Same as shipping details</span>
            </label>

            {!sameAsShipping && (
              <div className="grid grid-cols-2 gap-4 mt-3">
                {Object.keys(watch("billingDetails")).map((key) => (
                  <input
                    key={key}
                    type="text"
                    placeholder={key}
                    {...register(`billingDetails.${key}` as any, {
                      required: true,
                    })}
                    className="input input-bordered w-full"
                  />
                ))}
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full mt-4">
              Next
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="col-span-5  p-6 shadow-md rounded-lg">
          <div className="bg-white p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Order Summary
            </h2>

            {/* Product Details */}
            <div className="border p-4 rounded-lg flex items-center">
              <img
                src="https://via.placeholder.com/60"
                alt="Product"
                className="w-16 h-16 rounded-md object-cover"
              />
              <div className="ml-4">
                <h3 className="text-md font-semibold text-gray-800">
                  Dainty Shimmer Diamond Ring
                </h3>
                <p className="text-gray-600 text-sm">1 Qty</p>
                <p className="text-gray-800 font-semibold mt-1">₹27,499.00</p>
                <p className="text-gray-500 text-xs">
                  Estimated delivery: 10 Dec, 2021
                </p>
              </div>
            </div>

            {/* Price Details */}
            <div className="bg-pink-50 p-4 mt-4 rounded-lg">
              <div className="flex justify-between text-gray-700 mb-2">
                <span className="flex items-center">
                  <FaShoppingBag className="mr-2 text-gray-500" />
                  Sub Total
                </span>
                <span>₹27,798.00</span>
              </div>
              <div className="flex justify-between text-gray-700 mb-2">
                <span className="flex items-center">
                  <FaPercentage className="mr-2 text-gray-500" />
                  GST
                </span>
                <span>₹281.00</span>
              </div>
              <div className="flex justify-between text-gray-700 mb-2">
                <span className="flex items-center">
                  <FaTruck className="mr-2 text-gray-500" />
                  Home Delivery available
                </span>
                <span className="text-green-600 font-medium">Free</span>
              </div>

              {/* Coupon Applied */}
              <div className="flex justify-between text-green-600 font-medium mb-2">
                <span className="flex items-center">
                  <FaCheckCircle className="mr-2 text-green-500" />
                  Coupon Applied
                </span>
                <span>- ₹500.00</span>
              </div>

              {/* Bank Offers */}
              <div className="border-2 border-dashed border-pink-500 text-pink-500 p-3 rounded-md flex items-center justify-between mt-2 cursor-pointer">
                <span className="flex items-center">
                  <FaTag className="mr-2" />
                  10+ Bank Offers Available
                </span>
                <span className="text-lg">&gt;</span>
              </div>
            </div>

            {/* Total Payable */}
            <div className="flex justify-between font-bold text-gray-900 text-lg mt-4">
              <span>Total Payable</span>
              <span>₹27,798.00</span>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button className="px-4 py-2 border border-pink-500 text-pink-500 rounded-md">
                CONTINUE SHOPPING
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-md">
                COMPLETE ORDER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
