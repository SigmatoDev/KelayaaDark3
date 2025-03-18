"use client";

import { IoClose } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface SignInPopupProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

type Inputs = {
  fullName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export default function SignInPopup({ isOpen, setIsOpen }: SignInPopupProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const formSubmit: SubmitHandler<Inputs> = async (data) => {
    const { email, password, confirmPassword, fullName } = data;

    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          toast.error("Passwords do not match!");
          return;
        }

        // Handle Registration
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

      // Handle Login
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
        router.push("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (err) {
      toast.error("Google sign-in failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => setIsOpen(false)}
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">
          Welcome to Kelayaa
        </h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form className="space-y-4" onSubmit={handleSubmit(formSubmit)}>
          {isRegistering && (
            <div>
              <label className="text-gray-700 text-sm font-semibold">
                FULL NAME
              </label>
              <input
                type="text"
                {...register("fullName", { required: "Full name is required" })}
                placeholder="John Doe"
                className="w-full mt-1 p-2 border rounded-md bg-gray-100"
              />
              {errors.fullName && (
                <p className="text-red-500">{errors.fullName.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="text-gray-700 text-sm font-semibold">EMAIL</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Enter Your Email Here"
              className="w-full mt-1 p-2 border rounded-md bg-gray-100"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="text-gray-700 text-sm font-semibold">
              PASSWORD
            </label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              placeholder="Enter Your Password"
              className="w-full mt-1 p-2 border rounded-md bg-gray-100"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          {isRegistering && (
            <div>
              <label className="text-gray-700 text-sm font-semibold">
                CONFIRM PASSWORD
              </label>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                placeholder="Re-enter Your Password"
                className="w-full mt-1 p-2 border rounded-md bg-gray-100"
              />
              {errors.confirmPassword && (
                <p className="text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-md"
          >
            {isSubmitting
              ? "Loading..."
              : isRegistering
                ? "CREATE ACCOUNT"
                : "SIGN IN"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span
            className="text-pink-500 cursor-pointer"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Log In" : "Register"}
          </span>
        </p>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center w-full py-2 border rounded-md shadow-sm hover:bg-gray-100"
        >
          <FcGoogle className="mr-2" size={20} />{" "}
          {isRegistering ? "Sign Up" : "Sign In"} With Google
        </button>
      </div>
    </div>
  );
}
