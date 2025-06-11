"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Inputs = {
  email: string;
  password: string;
};

const Form = () => {
  const params = useSearchParams();
  const { data: session } = useSession();
  const router = useRouter();

  // Get the callback URL from the search params or set a default
  let callbackUrl = params.get("callbackUrl") || "/";
  console.log("Callback URL:", callbackUrl); // Log the callback URL

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Log session data for debugging
  // useEffect(() => {
  //   if (session) {
  //     console.log("Session data:", session); // Log session data
  //     if (session.user) {
  //       // Log user details
  //       console.log("User is logged in:", session.user);

  //       // Check if the user is an admin
  //       if (session.user.isAdmin) {
  //         console.log("User is an admin, redirecting to /admin/dashboard");
  //         router.push("/admin/dashboard"); // Redirect to admin dashboard if user is an admin
  //       } else {
  //         console.log(`User is not an admin, redirecting to ${callbackUrl}`);
  //         router.push(callbackUrl); // Otherwise, redirect to the callback URL or home
  //       }
  //     }
  //   } else {
  //     console.log("No session found");
  //   }
  // }, [session, callbackUrl, router]);

  const formSubmit: SubmitHandler<any> = async (form) => {
    const { email, password } = form;
    console.log("Form submitted with email:", email, "and password:", password);
    toast.loading("Logging in...");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // manual redirection
    });

    console.log("SignIn result:", result);

    if (result?.error) {
      console.log("SignIn failed:", result.error);
      toast.error("Login failed: " + result.error);
    } else {
      console.log("SignIn successful, fetching session...");

      // Fetch latest session data
      const res = await fetch("/api/auth/session");
      const sessionData = await res.json();

      console.log("Fetched session:", sessionData);

      // Store relevant session data
      if (sessionData?.user) {
        sessionStorage.setItem("userSession", JSON.stringify(sessionData.user));
      }

      // Show success and delay navigation
      toast.success("Login successful, redirecting...");

      setTimeout(() => {
        const isAdmin = sessionData?.user?.isAdmin;
        const redirectTo = isAdmin ? "/admin" : "/";
        window.location.href = redirectTo;
      }, 2000);
    }
  };

  return (
    <div className="card mx-auto my-4 max-w-sm bg-base-300">
      <div className="card-body">
        <h1 className="card-title">Admin Sign in</h1>
        {params?.get("error") && (
          <div className="alert text-error">
            {params.get("error") === "CredentialsSignin"
              ? "Invalid email or password"
              : params.get("error")}
          </div>
        )}
        {params?.get("success") && (
          <div className="alert text-success">{params.get("success")}</div>
        )}
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="my-2">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                  message: "Email is invalid",
                },
              })}
              className="input input-bordered w-full max-w-sm"
            />
            {errors.email?.message && (
              <div className="text-error">{errors.email.message}</div>
            )}
          </div>
          <div className="my-2">
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
              })}
              className="input input-bordered w-full max-w-sm"
            />
            {errors.password?.message && (
              <div className="text-error">{errors.password.message}</div>
            )}
          </div>
          <div className="my-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn bg-gray-900 text-white w-full"
            >
              {isSubmitting && (
                <span className="loading loading-spinner"></span>
              )}
              Sign in
            </button>
          </div>
        </form>
        {/* <div>
          Need an account?{" "}
          <Link className="link" href={`/register?callbackUrl=${callbackUrl}`}>
            Register
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default Form;
