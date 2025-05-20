import axios from "axios";
import qs from "qs";

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

export async function getPhonePeAccessToken(): Promise<string> {
  const now = Date.now();

  if (cachedToken && now < tokenExpiresAt - 60 * 1000) {
    return cachedToken!; // ✅ Non-null assertion
  }

  try {
    const data = qs.stringify({
      client_id: process.env.PHONEPE_CLIENT_ID!,
      client_secret: process.env.PHONEPE_CLIENT_SECRET!,
      client_version: process.env.PHONEPE_CLIENT_VERSION!,
      grant_type: "client_credentials",
    });

    const response = await axios.post(process.env.PHONEPE_AUTH_URL!, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { access_token, expires_at } = response.data;

    if (!access_token) {
      throw new Error("Failed to obtain PhonePe access token");
    }

    cachedToken = access_token;
    tokenExpiresAt = new Date(expires_at).getTime();

    return cachedToken!;
  } catch (error: any) {
    console.error("PhonePe Auth Error:", error.response?.data || error.message);
    throw new Error("PhonePe auth failed");
  }
}
