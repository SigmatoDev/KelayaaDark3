"use client";

import { IoClose } from "react-icons/io5";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface ResetPasswordPopupProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  prefillEmail?: string;
}

type ResetInputs = {
  email: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ResetPasswordPopup({
  isOpen,
  setIsOpen,
  prefillEmail,
}: ResetPasswordPopupProps) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    setValue,
    setError,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetInputs>({ mode: "onTouched" });

  useEffect(() => {
    if (prefillEmail) {
      setValue("email", prefillEmail);
    }
  }, [prefillEmail, setValue]);

  const onSubmit: SubmitHandler<ResetInputs> = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.newPassword,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.message?.toLowerCase().includes("email")) {
          setError("email", { type: "server", message: result.message });
        } else {
          toast.error(result.message || "Something went wrong");
        }
        return;
      }

      toast.success("Password reset successfully!");
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => setIsOpen(false)}
        >
          <IoClose size={22} />
        </button>

        <h2 className="text-xl font-semibold text-center mb-4">
          Reset Your Password
        </h2>

        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <label className="text-xs font-medium">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Enter your email"
              className={`w-full mt-1 p-2 border rounded-md text-sm bg-gray-100 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="relative">
            <label className="text-xs font-medium">New Password</label>
            <input
              type={showNewPassword ? "text" : "password"}
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="New password"
              className={`w-full mt-1 p-2 pr-10 border rounded-md text-sm bg-gray-100 ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            <span
              className="absolute right-3 top-9 text-gray-500 cursor-pointer"
              onClick={() => setShowNewPassword((prev) => !prev)}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
            {errors.newPassword && (
              <p className="text-red-600 text-xs mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="text-xs font-medium">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("newPassword") || "Passwords do not match",
              })}
              placeholder="Confirm password"
              className={`w-full mt-1 p-2 pr-10 border rounded-md text-sm bg-gray-100 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            <span
              className="absolute right-3 top-9 text-gray-500 cursor-pointer"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
            {errors.confirmPassword && (
              <p className="text-red-600 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold text-sm rounded-md disabled:opacity-50"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
