// lib/emails/sendOrderStatusUpdateEmails.ts

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

export const sendOrderStatusUpdateEmail = async ({
  order,
  status,
  note,
  changedAt,
}: {
  order: any;
  status: string;
  note?: string;
  changedAt: Date;
}) => {
  const { personalInfo, orderNumber, items, totalPrice } = order;

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });

  const statusLabels: Record<string, string> = {
    processing: "Processing",
    shipped: "Shipped",
    "out-for-delivery": "Out for Delivery",
    completed: "Delivered",
    cancelled: "Cancelled",
    failed: "Failed",
  };

  const formattedItems = items
    .map(
      (item: any) =>
        `<li>${item.name} (Qty: ${item.qty}) - ${formatter.format(item.price)}</li>`
    )
    .join("");

  const formattedDate = new Date(changedAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background-color: #f2f2f2;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
      overflow: hidden;
    }
    .header {
      background-color: #ffe4ec;
      padding: 20px;
      text-align: center;
    }
    .header img {
      max-width: 150px;
    }
    .title {
      font-size: 20px;
      color: #e688a2;
      margin-top: 10px;
    }
    .content {
      padding: 20px 30px;
    }
    .section {
      margin-bottom: 20px;
    }
    .section-title {
      font-weight: bold;
      margin-bottom: 10px;
      color: #555;
      font-size: 16px;
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
    .note-box {
      background-color: #f8f8f8;
      padding: 10px 15px;
      border-left: 4px solid #e688a2;
      margin-top: 10px;
      font-size: 14px;
      color: #444;
    }
    .footer {
      background-color: #f4f4f4;
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="https://kelayaa.com/Kelayaa%20-%20logo.webp" alt="Kelayaa Logo" />
      <div class="title">Order Status Updated</div>
    </div>

    <div class="content">
      <div class="section">
        <div class="section-title">Hi ${order.user?.name},</div>
        <p>Your order <strong>#${orderNumber}</strong> has been updated to <strong>${statusLabels[status]}</strong> as of <strong>${formattedDate}</strong>.</p>
        ${note ? `<div class="note-box"><strong>Note:</strong> ${note}</div>` : ""}
      </div>

      <div class="section">
        <div class="section-title">Order Summary</div>
        <div class="details">
          <p><strong>Total:</strong> ${formatter.format(totalPrice)}</p>
          <p><strong>Status:</strong> ${statusLabels[status]}</p>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Items</div>
        <ul class="items">
          ${formattedItems}
        </ul>
      </div>

      <div class="section">
        <p>If you have questions, reply to this email or contact us at <a href="mailto:support@kelayaa.com">support@kelayaa.com</a>.</p>
      </div>
    </div>

    <div class="footer">
      &copy; ${new Date().getFullYear()} Kelayaa. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

  const email: SendSmtpEmail = {
    sender: { email: "orders@kelayaa.com" },
    to: [{ email: personalInfo?.email }],
    subject: `Your Order #${orderNumber} is now ${statusLabels[status]}`,
    htmlContent,
  };

  try {
    await apiInstance.sendTransacEmail(email);
    console.log(`✅ Status update email sent to ${personalInfo?.email}`);
  } catch (error) {
    console.error("❌ Failed to send status update email:", error);
  }
};
