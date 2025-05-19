"use client";

import { IoClose, IoEye, IoEyeOff } from "react-icons/io5";
import { signIn } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ResetPasswordPopup from "./ResetPassword";

interface SignInPopupProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  prefillEmail?: string;
  message?: string;
}

type Inputs = {
  fullName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  mobileNumber?: string;
};

export default function SignInPopup({
  isOpen,
  setIsOpen,
  prefillEmail,
  message,
}: SignInPopupProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null); // General error (not field specific)
  const [isRegistering, setIsRegistering] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    setValue,
    reset,
    setError: setFormError,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  useEffect(() => {
    if (prefillEmail) {
      setValue("email", prefillEmail);
    }
  }, [prefillEmail, setValue]);

  const handleModeSwitch = () => {
    setIsRegistering((prev) => !prev);
    setError(null);
    reset(); // clear all fields
    if (prefillEmail) setValue("email", prefillEmail);
  };

  const handleForgotPassword = () => {
    setShowResetPassword(true);
    setError(null);
    reset(); // clear all fields
    if (prefillEmail) setValue("email", prefillEmail);
  };

  const formSubmit: SubmitHandler<Inputs> = async (data) => {
    const { email, password, confirmPassword, fullName, mobileNumber } = data;

    try {
      setError(null);

      if (isRegistering) {
        if (password !== confirmPassword) {
          // Show toast and also set form error below confirmPassword input
          toast.error("Passwords do not match!");
          setFormError("confirmPassword", {
            type: "manual",
            message: "Passwords do not match",
          });
          return;
        }

        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fullName,
            email,
            password,
            mobileNumber,
          }),
        });

        const responseData = await res.json();
        if (!res.ok) {
          if (responseData.message?.toLowerCase().includes("email")) {
            setFormError("email", {
              type: "server",
              message: responseData.message || "Email already exists",
            });
          } else {
            setError(responseData.message || "Registration failed");
          }
          return;
        }

        toast.success("Account created! Please login.");
        setIsRegistering(false);
        reset();
        return;
      }

      // LOGIN FLOW
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        // Show error below email field for better UX
        setFormError("email", {
          type: "manual",
          message: "Invalid email or password",
        });
        toast.error("Invalid email or password");
      } else {
        toast.success("Login successful!");
        setIsOpen(false);
        router.refresh();
      }
    } catch (err: any) {
      // General unexpected errors
      setError(err.message || "Something went wrong");
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
          aria-label="Close popup"
        >
          <IoClose size={22} />
        </button>

        <h2 className="text-xl font-semibold text-center mb-4">
          {isRegistering ? "Create Account" : "Login to Continue"}
        </h2>

        {message && (
          <div className="text-sm text-gray-700 mb-4 text-center bg-yellow-100 p-2 rounded">
            {message}
          </div>
        )}

        <form className="space-y-3" onSubmit={handleSubmit(formSubmit)}>
          {isRegistering && (
            <>
              <div>
                <label className="text-xs font-medium" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  aria-invalid={!!errors.fullName}
                  {...register("fullName", {
                    required: "Full name is required",
                  })}
                  placeholder="John Doe"
                  className="w-full mt-1 p-2 border rounded-md text-sm bg-gray-100"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium" htmlFor="mobileNumber">
                  Mobile Number
                </label>
                <input
                  id="mobileNumber"
                  type="tel"
                  aria-invalid={!!errors.mobileNumber}
                  {...register("mobileNumber", {
                    required: "Mobile number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Enter a valid 10-digit mobile number",
                    },
                  })}
                  className="w-full mt-1 p-2 border rounded-md text-sm bg-gray-100"
                />
                {/* Show any general error message (not linked to a field) */}
                {error && (
                  <div className="text-red-600 text-xs mb-3">
                    {error}
                  </div>
                )}
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              aria-invalid={!!errors.email}
              {...register("email", { required: "Email is required" })}
              placeholder="Email address"
              className="w-full mt-1 p-2 border rounded-md text-sm bg-gray-100"
              readOnly={!!prefillEmail}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-medium" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                aria-invalid={!!errors.password}
                {...register("password", {
                  required: "Password is required",
                  ...(isRegistering && {
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  }),
                })}
                placeholder="Password"
                className="w-full mt-1 p-2 pr-10 border rounded-md text-sm bg-gray-100"
              />
              <span
                className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
              </span>
            </div>
            {!isRegistering && (
              <div className="text-right mt-1">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-pink-500 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {isRegistering && (
            <div>
              <label className="text-xs font-medium" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  aria-invalid={!!errors.confirmPassword}
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                  placeholder="Confirm password"
                  className="w-full mt-1 p-2 pr-10 border rounded-md text-sm bg-gray-100"
                />
                <span
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <IoEyeOff size={18} />
                  ) : (
                    <IoEye size={18} />
                  )}
                </span>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold text-sm rounded-md"
          >
            {isSubmitting
              ? "Loading..."
              : isRegistering
                ? "Create Account"
                : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4 text-xs">
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span
            className="text-pink-500 cursor-pointer font-semibold"
            onClick={handleModeSwitch}
          >
            {isRegistering ? "Login" : "Register"}
          </span>
        </p>
      </div>

      {showResetPassword && (
        <ResetPasswordPopup
          isOpen={showResetPassword}
          setIsOpen={setShowResetPassword}
          prefillEmail={watch("email")}
        />
      )}
    </div>
  );
}
