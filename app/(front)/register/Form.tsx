"use client";

import { IoClose } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface AuthPopupProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

type SignInInputs = {
  email: string;
  password: string;
};

type RegisterInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function AuthPopup({ isOpen, setIsOpen }: AuthPopupProps) {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false); // Toggle SignIn/Register
  const [error, setError] = useState<string | null>(null);

  // Define the correct form type based on isRegister
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInputs>({
    defaultValues: isRegister
      ? { name: "", email: "", password: "", confirmPassword: "" }
      : { email: "", password: "" } as any,
  });

  // Sign In Handler
  const signInSubmit: SubmitHandler<SignInInputs> = async (data) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      setIsOpen(false);
      router.push("/dashboard");
    }
  };

  // Register Handler
  const registerSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    const { name, email, password } = data;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        toast.success("Account created! Please login.");
        setIsRegister(false);
      } else {
        const responseData = await res.json();
        throw new Error(responseData.message);
      }
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => setIsOpen(false)}
        >
          <IoClose size={24} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center mb-6">
          Welcome to Kelayaa
        </h2>

        {error && <div className="text-error text-center mb-4">{error}</div>}

        {/* Form */}
        <form
          className="space-y-4"
          onSubmit={handleSubmit(isRegister ? registerSubmit as SubmitHandler<any> : signInSubmit)}
        >
          {isRegister && (
            <div>
              <label className="text-gray-700 text-sm font-semibold">FULL NAME</label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                placeholder="Enter Your Full Name"
                className="w-full mt-1 p-2 border rounded-md bg-gray-100"
              />
              {isRegister && 'name' in errors && <p className="text-error">{errors.name?.message}</p>}
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
            {errors.email && <p className="text-error">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-gray-700 text-sm font-semibold">PASSWORD</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              placeholder="Enter Your Password"
              className="w-full mt-1 p-2 border rounded-md bg-gray-100"
            />
            {errors.password && <p className="text-error">{errors.password.message}</p>}
          </div>

          {isRegister && (
            <div>
              <label className="text-gray-700 text-sm font-semibold">CONFIRM PASSWORD</label>
              <input
                type="password"
                {...register("confirmPassword" as any, {
                  required: "Confirm Password is required",
                  validate: (value) => value === getValues("password") || "Passwords do not match",
                })}
                placeholder="Re-enter Your Password"
                className="w-full mt-1 p-2 border rounded-md bg-gray-100"
              />
              {errors.confirmPassword && <p className="text-error">{errors.confirmPassword.message}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-md"
          >
            {isSubmitting ? (
              <span className="loading loading-spinner"></span>
            ) : isRegister ? (
              "REGISTER"
            ) : (
              "SIGN IN"
            )}
          </button>
        </form>

        {/* Toggle Between Login/Register */}
        <p className="text-center text-gray-600 mt-4">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-pink-500 cursor-pointer"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </p>

        {/* OR Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Sign-In */}
        {!isRegister && (
          <button
            onClick={() => signIn("google")}
            className="flex items-center justify-center w-full py-2 border rounded-md shadow-sm hover:bg-gray-100"
          >
            <FcGoogle className="mr-2" size={20} /> Sign In With Google
          </button>
        )}
      </div>
    </div>
  );
}
