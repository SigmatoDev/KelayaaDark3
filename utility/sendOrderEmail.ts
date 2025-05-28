// lib/emails/sendOrderEmails.ts

import {
  TransactionalEmailsApi,
  SendSmtpEmail,
  TransactionalEmailsApiApiKeys,
} from "@sendinblue/client";

const apiKey = process.env.BREVO_API_KEY;

if (!apiKey) {
  throw new Error("BREVO_API_KEY is not defined in environment variables.");
}

const apiInstance = new TransactionalEmailsApi();
apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);

export const sendOrderEmails = async (order: any) => {
  const {
    personalInfo,
    items,
    totalPrice,
    shippingAddress,
    _id: orderId,
  } = order;

  const formattedItems = items
    .map(
      (item: any) =>
        `<li>${item.name} (Qty: ${item.quantity}) - ₹${item.price}</li>`
    )
    .join("");

  const htmlContent = (recipient: "user" | "admin") => `
    <h2>Order Confirmation ${recipient === "admin" ? "(Admin Copy)" : ""}</h2>
    <p>Order ID: ${orderId}</p>
    <p><strong>Name:</strong> ${personalInfo?.fullName}</p>
    <p><strong>Email:</strong> ${personalInfo?.email}</p>
    <p><strong>Phone:</strong> ${personalInfo?.phone}</p>
    <p><strong>Shipping Address:</strong> ${shippingAddress?.address}, ${shippingAddress?.city}</p>
    <p><strong>Total:</strong> ₹${totalPrice}</p>
    <h3>Items:</h3>
    <ul>${formattedItems}</ul>
    <p>Thank you for ordering with Kelayaa!</p>
  `;

  // Email to User
  const userEmail: SendSmtpEmail = {
    sender: { email: "cdquery@kelayaa.com" },
    to: [{ email: personalInfo?.email }],
    subject: "Your Kelayaa Order Confirmation",
    htmlContent: htmlContent("user"),
  };

  // Email to Admin(s)
  const adminEmail: SendSmtpEmail = {
    sender: { email: "cdquery@kelayaa.com" },
    to: [
      { email: "dineshbhukta.sigmato@gmail.com" },
      { email: "arayan@kelayaa.com" },
      { email: "nuthan@sigmato.com" },
    ],
    subject: `New Order Received - ${personalInfo?.fullName}`,
    htmlContent: htmlContent("admin"),
  };

  try {
    await apiInstance.sendTransacEmail(userEmail);
    await apiInstance.sendTransacEmail(adminEmail);
    console.log("✅ Emails sent to user and admin.");
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};
