import UserModel from "@/lib/models/UserModel";
import {
  TransactionalEmailsApi,
  SendSmtpEmail,
  TransactionalEmailsApiApiKeys,
} from "@sendinblue/client";

export const sendAbandonedCartEmail = async (cart: any) => {
  const apiKey = process.env.BREVO_API_KEY; // Ensure this is set in your environment
  if (!apiKey) {
    console.error("❌ No Brevo API key provided");
    return;
  }

  // Initialize the Brevo API client
  const apiInstance = new TransactionalEmailsApi();
  apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);
  console.log("📡 Initialized Brevo API client with API key.");

  // Fetch the user by userId
  const user = await UserModel.findById(cart.userId);

  if (!user?.email) {
    console.error("❌ User email is missing or user not found");
    return;
  }

  console.log(`✅ User found: ${user.name} (${user.email})`);

  // Construct the email content
  const cartHTML = cart.items
    .map(
      (item: any) => `
      <li>
        <img src="${item.image}" width="40" /> ${item.name} (Qty: ${item.qty}) - ₹${item.price}
      </li>
    `
    )
    .join("");

  const resumeLink = `https://kelayaa.com/cart`;

  const email: SendSmtpEmail = {
    to: [{ email: user.email }],
    sender: { name: "Kelayaa", email: "orders@kelayaa.com" },
    subject: "Your Kelayaa cart is waiting for you 💝",
    htmlContent: `
      <h2>Hey ${user.name || "there"},</h2>
      <p>You left these items in your cart:</p>
      <ul>${cartHTML}</ul>
      <p><a href="${resumeLink}" style="background:#e688a2;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">Resume Your Cart</a></p>
      <p>Need help? Email us at <a href="mailto:support@kelayaa.com">support@kelayaa.com</a></p>
    `,
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
