import axios from "axios";
import crypto from "crypto";

interface PhonePeConfig {
  merchantId: string;
  saltKey: string;
  saltIndex: string;
  isDev: boolean;
}

interface InitPaymentPayload {
  amount: number;
  transactionId: string;
  userId?: string;
  redirectUrl: string;
  callbackUrl: string;
}

export default class PhonepeGateway {
  private merchantId: string;
  private saltKey: string;
  private saltIndex: string;
  private baseUrl: string;

  constructor(config: PhonePeConfig) {
    this.merchantId = config.merchantId;
    this.saltKey = config.saltKey;
    this.saltIndex = config.saltIndex;
    this.baseUrl = config.isDev
      ? "https://api-preprod.phonepe.com/apis/pg-sandbox"
      : "https://api.phonepe.com/apis/pg";
    console.log("PhonePe Gateway initialized with:");
    console.log("  Merchant ID:", this.merchantId);
    console.log("  Salt Index:", this.saltIndex);
    console.log("  Environment:", config.isDev ? "Sandbox" : "Production");
    console.log("  Base URL:", this.baseUrl);
  }

  async initPayment(payload: InitPaymentPayload) {
    const reqBody = {
      merchantId: this.merchantId,
      merchantTransactionId: payload.transactionId,
      merchantUserId: payload.userId || "guest_user",
      amount: payload.amount * 100, // Convert to paise
      redirectUrl: payload.redirectUrl,
      redirectMode: "REDIRECT",
      callbackUrl: payload.callbackUrl,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    console.log("Payment request body:", JSON.stringify(reqBody, null, 2));

    const base64Payload = Buffer.from(JSON.stringify(reqBody)).toString(
      "base64"
    );
    console.log("Base64 encoded payload:", base64Payload);

    const stringToSign = base64Payload + "/v1/pay" + this.saltKey;
    console.log("String to sign:", stringToSign);

    const sha256 = crypto
      .createHash("sha256")
      .update(stringToSign)
      .digest("hex");

    const xVerify = `${sha256}###${this.saltIndex}`;
    console.log("X-VERIFY:", xVerify);

    const endpoint = `${this.baseUrl}/v1/pay`;
    console.log("Making request to:", endpoint);

    try {
      const response = await axios.post(
        endpoint,
        { request: base64Payload },
        {
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": xVerify,
            "X-MERCHANT-ID": this.merchantId,
          },
        }
      );

      console.log(
        "PhonePe API response:",
        JSON.stringify(response.data, null, 2)
      );

      if (response.data.success) {
        return {
          success: true,
          redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
        };
      } else {
        console.error("PhonePe response error code:", response.data.code);
        return { success: false, error: response.data.code };
      }
    } catch (err: any) {
      console.error("PhonePe API call failed:");
      console.error("Status:", err?.response?.status);
      console.error("Headers:", err?.response?.headers);
      console.error("Data:", err?.response?.data);
      return {
        success: false,
        error: err?.response?.data?.message || err.message || "Unknown error",
      };
    }
  }
}
