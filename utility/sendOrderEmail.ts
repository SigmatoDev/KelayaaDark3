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
    user,
    personalInfo,
    items,
    totalPrice,
    shippingAddress,
    orderNumber,
    _id: orderId,
  } = order;

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });

  const formattedItems = items
    .map(
      (item: any) =>
        `<li>${item.name} (Qty: ${item.qty}) - ${formatter.format(item.price)}</li>`
    )
    .join("");

  const htmlContent = (recipient: "user" | "admin") => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
        color: #333;
      }
      .email-wrapper {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 0 10px rgba(0,0,0,0.05);
      }
      .header {
        background-color: #ffe4ec;
        text-align: center;
        padding: 20px;
      }
      .header img {
        max-width: 160px;
      }
      .content {
        padding: 20px 30px;
      }
      .title {
        color: #e688a2;
        font-size: 22px;
        margin-top: 10px;
      }
      .section {
        margin: 20px 0;
      }
      .section-title {
        font-weight: bold;
        margin-bottom: 10px;
        font-size: 16px;
        color: #555;
      }
      .details p {
        margin: 5px 0;
        font-size: 14px;
      }
      ul.items {
        padding-left: 20px;
        margin: 0;
      }
      ul.items li {
        font-size: 14px;
        margin-bottom: 5px;
      }
      .footer {
        background-color: #f4f4f4;
        text-align: center;
        font-size: 12px;
        color: #888;
        padding: 15px;
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="header">
        <img src="https://kelayaa.com/Kelayaa%20-%20logo.webp" alt="Kelayaa Logo" />
        <div class="title">
          ${recipient === "admin" ? "New Order Alert 🚀" : "Thank You for Your Order 💖"}
        </div>
      </div>

      <div class="content">
        <div class="section">
          <div class="section-title">Order Summary</div>
          <div class="details">
            <p><strong>Order ID:</strong> ${orderNumber}</p>
            <p><strong>Total Amount:</strong> ${formatter.format(totalPrice)}</p>
            <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Customer Info</div>
          <div class="details">
            <p><strong>Name:</strong> ${user?.name}</p>
            <p><strong>Email:</strong> ${personalInfo?.email}</p>
            <p><strong>Phone:</strong> ${personalInfo?.mobileNumber}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Shipping Address</div>
          <div class="details">
            <p>${shippingAddress?.address},</p>
            <p>${shippingAddress?.city}, ${shippingAddress?.state} - ${shippingAddress?.postalCode}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Items Ordered</div>
          <ul class="items">
            ${formattedItems}
          </ul>
        </div>

        ${
          recipient === "user"
            ? `<p>We’ll notify you when your order is on its way. 🎁</p>
               <p>Questions? Reach out anytime at <a href="mailto:support@kelayaa.com">support@kelayaa.com</a></p>`
            : `<p><strong>Note:</strong> This is a new order from the website. Please check the admin dashboard for full details.</p>`
        }
      </div>

      <div class="footer">
        &copy; ${new Date().getFullYear()} Kelayaa. All rights reserved.<br/>
      </div>
    </div>
  </body>
</html>
`;

  // Email to User
  const userEmail: SendSmtpEmail = {
    sender: { email: "orders@kelayaa.com" },
    to: [{ email: personalInfo?.email }],
    subject: "Your Kelayaa Order Confirmation",
    htmlContent: htmlContent("user"),
  };

  // Email to Admin(s)
  const adminEmail: SendSmtpEmail = {
    sender: { email: "orders@kelayaa.com" },
    to: [
      { email: "bharat@metamorfs.com" },
      { email: "aryan@kelayaa.com" },
      { email: "arushi@kelayaa.com" },
      // { email: "nuthan@sigmato.com" },
      // { email: "dineshbhukta.sigmato@gmail.com" },
    ],
    subject: `New Order Received 🎉`,
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

// Designed with ❤️ by Kelayaa Team.
