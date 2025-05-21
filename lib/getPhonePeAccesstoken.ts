import axios from "axios";
import qs from "qs";

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

export async function getPhonePeAccessToken(): Promise<string> {
  const now = Date.now();
  console.log("🔄 Checking cached token...");
  console.log("⏱️ Current time:", now, "Token expiry time:", tokenExpiresAt);

  if (cachedToken && now < tokenExpiresAt - 60 * 1000) {
    console.log("✅ Using cached token");
    return cachedToken!;
  }

  try {
    console.log("📡 No valid cached token, requesting new one...");

    const data = qs.stringify({
      client_id: process.env.PHONEPE_CLIENT_ID!,
      client_secret: process.env.PHONEPE_CLIENT_SECRET!,
      client_version: process.env.PHONEPE_CLIENT_VERSION!,
      grant_type: "client_credentials",
    });

    console.log("📦 Request data:", data);
    console.log("🌐 POST URL:", process.env.PHONEPE_AUTH_URL);

    const response = await axios.post(process.env.PHONEPE_AUTH_URL!, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    console.log("📥 Response data:", response.data);

    const { access_token, expires_at } = response.data;

    if (!access_token) {
      console.error("❌ Access token missing in response");
      throw new Error("Failed to obtain PhonePe access token");
    }

    cachedToken = access_token;
    tokenExpiresAt = new Date(expires_at).getTime();

    console.log("🔐 New access token obtained");
    console.log("⏳ Expires at (ms):", tokenExpiresAt);

    return cachedToken!;
  } catch (error: any) {
    console.error(
      "❗ PhonePe Auth Error:",
      error.response?.data || error.message
    );
    throw new Error("PhonePe auth failed");
  }
}
