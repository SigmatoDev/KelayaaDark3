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
    paymentStatus,
  } = order;

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });

  const formattedItems = items
    .map(
      (item: any, index: number) => `
      <li style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
        <span style="font-weight: bold; color: #555;">${index + 1}.</span>
        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;" />
        <div>
          <div style="font-size: 14px; font-weight: 600; color: #333;">${item.name}</div>
          <div style="font-size: 13px; color: #777;">Qty: ${item.qty} — ${formatter.format(item.price)}</div>
        </div>
      </li>
    `
    )
    .join("");

  const htmlContent = (recipient: "user" | "admin") => {
    const isFailed = paymentStatus === "FAILED";
    const retryUrl = `https://kelayaa.com/retry-payment?orderId=${orderId}`;

    const title =
      recipient === "admin"
        ? isFailed
          ? "Order Payment Failed 🚫"
          : "New Order Alert 🚀"
        : isFailed
          ? "Payment Failed for Your Order 💳"
          : "Thank You for Your Order 💖";

    const actionSection =
      isFailed && recipient === "user" && personalInfo?.userType !== "guest"
        ? `<div style="text-align: center; margin: 30px 0;">
            <a href="${retryUrl}" style="
              background-color: #e74c3c;
              color: #fff;
              padding: 12px 24px;
              border-radius: 6px;
              font-weight: bold;
              text-decoration: none;
              display: inline-block;
            ">Retry Payment</a>
            <p style="margin-top: 10px; font-size: 13px; color: #888;">
              If you continue facing issues, contact <a href="mailto:support@kelayaa.com">support@kelayaa.com</a>
            </p>
          </div>`
        : "";

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    :root {
      color-scheme: light dark;
    }

    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 30px 0;
      color: #333;
    }

    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .header {
      background-color: #ffe4ec;
      text-align: center;
      padding: 24px 20px;
    }

    .header img {
      max-width: 140px;
    }

    .title {
      color: #e688a2;
      font-size: 22px;
      font-weight: bold;
      margin-top: 12px;
    }

    .content {
      padding: 24px 32px;
    }

    .section {
      margin-bottom: 24px;
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 10px;
      color: #444;
    }

    .details p {
      margin: 6px 0;
      font-size: 14px;
      color: #555;
    }

    ul.items {
      padding-left: 0;
      list-style: none;
      margin: 0;
    }

    .footer {
      background-color: #f0f0f0;
      text-align: center;
      padding: 18px;
      font-size: 13px;
      color: #666;
    }

    .footer a {
      color: #e688a2;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <img src="https://kelayaa.com/Kelayaa%20-%20logo.webp" alt="Kelayaa Logo" />
      <div class="title">${title}</div>
    </div>

    <div class="content">
      <div class="section">
        <div class="section-title">Order Summary</div>
        <div class="details">
          <p><strong>Order ID:</strong> ${orderNumber}</p>
          <p><strong>Total:</strong> ${formatter.format(totalPrice)}</p>
          <p><strong>Payment Status:</strong> ${paymentStatus}</p>
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
          <p>${shippingAddress?.address}</p>
          <p>${shippingAddress?.city}, ${shippingAddress?.state} - ${shippingAddress?.postalCode}</p>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Items Ordered</div>
        <ul class="items">
          ${formattedItems}
        </ul>
      </div>

      ${actionSection}
    </div>

    <div class="footer">
      <p>Need help with your order? Contact us at <a href="mailto:support@kelayaa.com">support@kelayaa.com</a></p>
      <p>&copy; ${new Date().getFullYear()} Kelayaa. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
  };

  const subjectPrefix = `Order #${orderNumber}`;

  const userEmail: SendSmtpEmail = {
    sender: { email: "orders@kelayaa.com" },
    to: [{ email: personalInfo?.email }],
    subject:
      paymentStatus === "FAILED"
        ? `${subjectPrefix} - Payment Failed`
        : `${subjectPrefix} - Order Confirmation`,
    htmlContent: htmlContent("user"),
  };

  const adminEmail: SendSmtpEmail = {
    sender: { email: "orders@kelayaa.com" },
    to: [
      { email: "bharat@metamorfs.com" },
      { email: "aryan@kelayaa.com" },
      { email: "arushi@kelayaa.com" },
    ],
    subject:
      paymentStatus === "FAILED"
        ? `${subjectPrefix} - Payment Failure Alert`
        : `${subjectPrefix} - New Order Received 🎉`,
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
