import { NextResponse } from "next/server";
import {
  TransactionalEmailsApi,
  SendSmtpEmail,
  TransactionalEmailsApiApiKeys,
} from "@sendinblue/client";

import dbConnect from "@/lib/dbConnect";
import PasswordOtpModel from "@/lib/models/PasswordOtpModel";

export const POST = async (req: Request) => {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

    await dbConnect();
    await PasswordOtpModel.deleteMany({ email }); // Remove existing OTPs for this email
    await PasswordOtpModel.create({ email, otp, expiresAt: expiry });

    const apiInstance = new TransactionalEmailsApi();
    apiInstance.setApiKey(
      TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY || ""
    );

    const emailData: SendSmtpEmail = {
      sender: { email: "no-reply@kelayaa.com", name: "Kelayaa" },
      to: [{ email }],
      subject: "Your OTP for Password Reset",
      htmlContent: `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
    <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05); padding: 30px;">
      <h2 style="color: #e91e63; text-align: center;">Password Reset Request</h2>

      <p style="font-size: 15px; color: #333;">Hi there,</p>
      <p style="font-size: 15px; color: #333;">
        You requested to reset your password. Use the OTP below to proceed. This code is valid for <strong>10 minutes</strong>.
      </p>

      <div style="margin: 30px 0; text-align: center;">
        <div style="
          display: inline-block;
          font-size: 32px;
          letter-spacing: 12px;
          font-weight: bold;
          color: #111;
          background: #f3f3f3;
          padding: 14px 24px;
          border-radius: 8px;
          border: 1px solid #ddd;
        ">
          ${otp}
        </div>
      </div>

      <p style="font-size: 14px; color: #555;">
        If you didn’t request this, you can safely ignore this email.
      </p>

      <p style="font-size: 14px; color: #555;">Thanks,<br/>Team Kelayaa</p>

      <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
      <p style="font-size: 12px; color: #aaa; text-align: center;">
        This is an automated message. Please do not reply.
      </p>
    </div>
  </div>
`,
    };

    await apiInstance.sendTransacEmail(emailData);

    return NextResponse.json({ message: "OTP sent" }, { status: 200 });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { message: "Failed to send OTP" },
      { status: 500 }
    );
  }
};
