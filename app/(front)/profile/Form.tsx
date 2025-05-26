"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Inputs = {
  name: string;
  email: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
};

const Profile = () => {
  const { data: session, update } = useSession();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  useEffect(() => {
    if (session && session.user) {
      setValue("name", session.user.name || "");
      setValue("email", session.user.email || "");
      setValue("mobileNumber", (session.user as any).mobileNumber || ""); // assuming session.user.mobileNumber exists
    }
  }, [session, setValue]);

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { name, email, mobileNumber, password } = form;
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, mobileNumber, password }),
      });
      if (res.status === 200) {
        toast.success("Profile updated successfully");
        await update({
          ...session,
          user: {
            ...session?.user,
            name,
            email,
            mobileNumber,
          },
        });
      } else {
        const data = await res.json();
        toast.error(data.message || "Error updating profile");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Profile</h2>

      <form className="space-y-4" onSubmit={handleSubmit(formSubmit)}>
        <div>
          <label className="text-gray-700 text-sm font-semibold">NAME</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full mt-1 p-2 border rounded-md bg-gray-100"
          />
          {errors.name && <p className="text-error">{errors.name.message}</p>}
        </div>

        <div>
          <label className="text-gray-700 text-sm font-semibold">EMAIL</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full mt-1 p-2 border rounded-md bg-gray-100"
          />
          {errors.email && <p className="text-error">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-gray-700 text-sm font-semibold">
            MOBILE NUMBER
          </label>
          <input
            type="tel"
            {...register("mobileNumber", {
              required: "Mobile number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter a valid 10-digit mobile number",
              },
            })}
            className="w-full mt-1 p-2 border rounded-md bg-gray-100"
          />
          {errors.mobileNumber && (
            <p className="text-error">{errors.mobileNumber.message}</p>
          )}
        </div>

        <div>
          <label className="text-gray-700 text-sm font-semibold">
            NEW PASSWORD
          </label>
          <input
            type="password"
            {...register("password")}
            className="w-full mt-1 p-2 border rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label className="text-gray-700 text-sm font-semibold">
            CONFIRM PASSWORD
          </label>
          <input
            type="password"
            {...register("confirmPassword", {
              validate: (value) =>
                getValues("password") === value || "Passwords do not match",
            })}
            className="w-full mt-1 p-2 border rounded-md bg-gray-100"
          />
          {errors.confirmPassword && (
            <p className="text-error">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-md"
        >
          {isSubmitting ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "UPDATE"
          )}
        </button>
      </form>
    </div>
  );
};

export default Profile;
