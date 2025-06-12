import UserModel from "@/lib/models/UserModel";
import {
  TransactionalEmailsApi,
  SendSmtpEmail,
  TransactionalEmailsApiApiKeys,
} from "@sendinblue/client";

export const sendAbandonedCartEmail = async (cart: any) => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("❌ No Brevo API key provided");
    return;
  }

  const apiInstance = new TransactionalEmailsApi();
  apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);
  console.log("📡 Initialized Brevo API client with API key.");

  const user = await UserModel.findById(cart.userId);

  if (!user?.email) {
    console.error("❌ User email is missing or user not found");
    return;
  }

  console.log(`✅ User found: ${user.name} (${user.email})`);

  const resumeLink = `https://kelayaa.com/cart`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 30px 0;
    }

    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
      overflow: hidden;
    }

    .header {
      background-color: #ffe4ec;
      padding: 24px 30px;
      text-align: center;
    }

    .header img {
      width: 140px;
      margin-bottom: 10px;
    }

    .header h2 {
      color: #e688a2;
      margin: 0;
      font-size: 22px;
    }

    .content {
      padding: 24px 30px;
      color: #333;
    }

    .content p {
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    ul.cart-items {
      list-style: none;
      padding: 0;
      margin: 0 0 20px 0;
    }

    ul.cart-items li {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      border-bottom: 1px solid #eee;
      padding-bottom: 12px;
    }

    ul.cart-items img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      margin-right: 14px;
      border-radius: 6px;
    }

    ul.cart-items .details {
      font-size: 14px;
      color: #444;
    }

    .resume-btn {
      display: inline-block;
      color: #e688a2;
      text-decoration: none;
      padding: 12px 24px;
      border:1px solid #e688a2;
      border-radius: 6px;
      font-weight: bold;
      font-size: 14px;
      margin: 0 auto;
    }

    .footer {
      background-color: #f0f0f0;
      text-align: center;
      padding: 20px;
      font-size: 13px;
      color: #777;
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
      <img
        src="https://kelayaaimages.s3.ap-south-1.amazonaws.com/kelayaa-assets/Kelayaa-mail.png"
        alt="Kelayaa Logo"
        style="width: 230px;"
      />      
      <h2>Still thinking it over?</h2>
    </div>
    <div class="content">
      <p>Hey ${user.name || "there"},</p>
      <p>We noticed you left these items in your cart. They're still waiting for you! 😉</p>

      <ul class="cart-items">
        ${cart.items
          .map(
            (item: any) => `
          <li>
            <img src="${item.image}" alt="${item.name}" />
            <div class="details">
              <strong>${item.name}</strong><br />
              Qty: ${item.qty} — ₹${item.price.toFixed(2)}
            </div>
          </li>`
          )
          .join("")}
      </ul>

      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${resumeLink}" class="resume-btn">Resume Your Cart</a>
      </div>

      <p style="text-align: center; font-size: 14px;">Complete your purchase before it's too late. 🕒</p>
    </div>

    <div class="footer">
      Need help? Email us at <a href="mailto:support@kelayaa.com">support@kelayaa.com</a><br/>
      &copy; ${new Date().getFullYear()} Kelayaa. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

  const email: SendSmtpEmail = {
    to: [{ email: user.email }],
    sender: { name: "Kelayaa", email: "orders@kelayaa.com" },
    subject: "Your Kelayaa cart is waiting for you 💝",
    htmlContent,
  };

  try {
    console.log("📬 Sending email...");
    const response = await apiInstance.sendTransacEmail(email);
    console.log(`✅ Abandoned cart email sent to ${user.email}`);
    console.log("📄 Email response:", response);
  } catch (err) {
    console.error("❌ Failed to send abandoned cart email", err);
  }
};
