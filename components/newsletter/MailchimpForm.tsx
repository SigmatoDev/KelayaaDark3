"use client";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function MailchimpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js";
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      (window as any).fnames = new Array();
      (window as any).ftypes = new Array();
      (window as any).fnames[0] = "EMAIL";
      (window as any).ftypes[0] = "email";
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Detect form clear after submit
  useEffect(() => {
    const interval = setInterval(() => {
      if (isSubmitting && emailRef.current?.value === "") {
        toast.success("Thank you for subscribing!");
        setIsSubmitting(false);
      }
    }, 500); // poll every half second

    return () => clearInterval(interval);
  }, [isSubmitting]);

  const handleClick = () => {
    setIsSubmitting(true);
  };

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto
                    sm:p-6 sm:max-w-full sm:rounded-md"
    >
      <Toaster position="top-center" />

      <h2
        className="text-md font-bold mb-6
                     sm:text-2xl sm:mb-4"
      >
        Stay Updated with Our Latest Collections
      </h2>

      <form
        action="https://kelayaa.us12.list-manage.com/subscribe/post?u=4171ce39224d802e226dfe2db&amp;id=23ec2aa225&amp;f_id=00b9f3e6f0"
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        target="_blank"
        className="space-y-4"
      >
        {/* <div
          className="text-gray-600 text-sm mb-4
                        sm:text-xs sm:mb-2"
        >
          <span className="text-pink-600">*</span> indicates required
        </div> */}

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="mce-EMAIL"
            className="text-sm font-medium
                                                sm:text-xs"
          >
            Email Address <span className="text-pink-600">*</span>
          </label>
          <input
            type="email"
            name="EMAIL"
            id="mce-EMAIL"
            required
            ref={emailRef}
            className="border rounded-md px-4 py-2 focus:outline-pink-500
                       sm:px-3 sm:py-1.5 sm:text-sm"
          />
        </div>

        <div
          style={{ position: "absolute", left: "-5000px" }}
          aria-hidden="true"
        >
          <input
            type="text"
            name="b_4171ce39224d802e226dfe2db_23ec2aa225"
            tabIndex={-1}
            defaultValue=""
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            name="subscribe"
            id="mc-embedded-subscribe"
            onClick={handleClick}
            className="bg-[#dc7f99] hover:bg-black text-white font-semibold py-2 px-6 rounded-md cursor-pointer transition flex items-center justify-center gap-2
                       sm:py-1.5 sm:px-4 sm:text-sm"
          >
            {isSubmitting ? (
              <span
                className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5
                               sm:w-4 sm:h-4"
              ></span>
            ) : (
              "Subscribe"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
