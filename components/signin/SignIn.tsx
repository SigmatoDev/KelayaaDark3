"use client";

import { IoClose } from "react-icons/io5";
import { signIn } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

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
};

export default function SignInPopup({
  isOpen,
  setIsOpen,
  prefillEmail,
  message,
}: SignInPopupProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  useEffect(() => {
    if (prefillEmail) {
      setValue("email", prefillEmail);
    }
  }, [prefillEmail, setValue]);

  const formSubmit: SubmitHandler<Inputs> = async (data) => {
    const { email, password, confirmPassword, fullName } = data;

    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          toast.error("Passwords do not match!");
          return;
        }

        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: fullName, email, password }),
        });

        const responseData = await res.json();
        if (!res.ok) {
          throw new Error(responseData.message || "Registration failed");
        }

        toast.success("Account created! Please login.");
        setIsRegistering(false);
        return;
      }

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        toast.error("Invalid email or password");
      } else {
        toast.success("Login successful!");
        setIsOpen(false);
        router.refresh();
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
          {isRegistering ? "Create Account" : "Login to Continue"}
        </h2>

        {error && (
          <div className="text-red-500 text-center text-sm mb-4">{error}</div>
        )}

        {message && (
          <div className="text-sm text-gray-700 mb-4 text-center bg-yellow-100 p-2 rounded">
            {message}
          </div>
        )}

        <form className="space-y-3" onSubmit={handleSubmit(formSubmit)}>
          {isRegistering && (
            <div>
              <label className="text-xs font-medium">Full Name</label>
              <input
                type="text"
                {...register("fullName", {
                  required: "Full name is required",
                })}
                placeholder="John Doe"
                className="w-full mt-1 p-2 border rounded-md text-sm bg-gray-100"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-medium">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Email address"
              className="w-full mt-1 p-2 border rounded-md text-sm bg-gray-100"
              readOnly={!!prefillEmail}
            />
          </div>

          <div>
            <label className="text-xs font-medium">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              placeholder="Password"
              className="w-full mt-1 p-2 border rounded-md text-sm bg-gray-100"
            />
            {!isRegistering && (
              <div className="text-right mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/forgot-password");
                  }}
                  className="text-xs text-pink-500 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </div>

          {isRegistering && (
            <div>
              <label className="text-xs font-medium">Confirm Password</label>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                placeholder="Confirm password"
                className="w-full mt-1 p-2 border rounded-md text-sm bg-gray-100"
              />
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
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}
