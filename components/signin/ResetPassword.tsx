"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

interface ResetPasswordPopupProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  prefillEmail?: string;
}

type Step = "email" | "otp" | "reset";

export default function ResetPasswordPopup({
  isOpen,
  setIsOpen,
  prefillEmail,
}: ResetPasswordPopupProps) {
  const [step, setStep] = useState<Step>("email");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (prefillEmail) {
      setValue("email", prefillEmail);
    }
  }, [prefillEmail, setValue]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input automatically
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const onSubmit = async (data: any) => {
    if (step === "reset") {
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
          toast.error(result.message || "Something went wrong");
          return;
        }

        toast.success("Password reset successfully!");
        setIsOpen(false);
        setStep("email");
        setOtp(Array(6).fill(""));
      } catch (err: any) {
        toast.error(err.message || "Something went wrong");
      }
    }
  };

  const sendOtp = async () => {
    const isValid = await trigger("email");
    if (!isValid) return;

    try {
      const res = await fetch("/api/auth/reset-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: watch("email") }),
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message || "Failed to send OTP");
      } else {
        toast.success("OTP sent to your email");
        setStep("otp");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const verifyOtp = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: watch("email"),
          otp: fullOtp,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message || "Invalid OTP");
      } else {
        toast.success("OTP verified");
        setStep("reset");
      }
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
          Reset Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {step === "email" && (
            <>
              <div>
                <label className="text-sm font-medium">Email</label>
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
              <button
                type="button"
                onClick={sendOtp}
                className="w-full py-2 bg-blue-600 text-white font-semibold text-sm rounded-md hover:bg-blue-700"
              >
                Send OTP
              </button>
            </>
          )}

          {step === "otp" && (
            <>
              <label className="text-sm font-medium">Enter 6-digit OTP</label>
              <div className="flex justify-between gap-1">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-10 h-10 text-center border rounded-md text-lg"
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={verifyOtp}
                className="w-full py-2 mt-2 bg-green-600 text-white font-semibold text-sm rounded-md hover:bg-green-700"
              >
                Verify OTP
              </button>
            </>
          )}

          {step === "reset" && (
            <>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={watch("email")}
                  readOnly
                  className="w-full mt-1 p-2 border rounded-md text-sm bg-gray-200"
                />
              </div>

              {/* New Password */}
              <div className="relative">
                <label className="text-sm font-medium">New Password</label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 6,
                      message: "Must be at least 6 characters",
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
                <label className="text-sm font-medium">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (val) =>
                      val === watch("newPassword") || "Passwords do not match",
                  })}
                  placeholder="Confirm password"
                  className={`w-full mt-1 p-2 pr-10 border rounded-md text-sm bg-gray-100 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <span
                  className="absolute right-3 top-9 text-gray-500 cursor-pointer"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </span>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 mt-2 bg-red-600 text-white font-semibold text-sm rounded-md disabled:opacity-50 hover:bg-red-700"
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
