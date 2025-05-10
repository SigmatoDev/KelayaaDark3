"use client";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function MailchimpForm() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js";
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      (window as any).fnames = new Array();
      (window as any).ftypes = new Array();
      (window as any).fnames[0] = 'EMAIL';
      (window as any).ftypes[0] = 'email';
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = () => {
    toast.success('Thank you for subscribing!');
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Stay Updated with Our Latest Collections</h2>

      <form
        action="https://kelayaa.us12.list-manage.com/subscribe/post?u=4171ce39224d802e226dfe2db&amp;id=23ec2aa225&amp;f_id=00b9f3e6f0"
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        target="_blank"
        className="space-y-4"
        onSubmit={handleSubmit}
      >
        <div className="text-gray-600 text-center text-sm mb-4">
          <span className="text-pink-600">*</span> indicates required
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="mce-EMAIL" className="text-sm font-medium">
            Email Address <span className="text-pink-600">*</span>
          </label>
          <input
            type="email"
            name="EMAIL"
            id="mce-EMAIL"
            required
            className="border rounded-md px-4 py-2 focus:outline-pink-500"
          />
        </div>

        {/* hidden bot field */}
        <div style={{ position: "absolute", left: "-5000px" }} aria-hidden="true">
          <input type="text" name="b_4171ce39224d802e226dfe2db_23ec2aa225" tabIndex={-1} defaultValue="" />
        </div>

        <div className="text-center">
          <input
            type="submit"
            value="Subscribe"
            name="subscribe"
            id="mc-embedded-subscribe"
            className="bg-[#dc7f99] hover:bg-black text-white font-semibold py-2 px-6 rounded-md cursor-pointer transition"
          />
        </div>
      </form>
    </div>
  );
}
