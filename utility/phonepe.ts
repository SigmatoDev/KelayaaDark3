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
      : "https://api.phonepe.com/apis/hermes";
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

    const base64Payload = Buffer.from(JSON.stringify(reqBody)).toString(
      "base64"
    );
    const stringToSign = base64Payload + "/pg/v1/pay" + this.saltKey;
    const sha256 = crypto
      .createHash("sha256")
      .update(stringToSign)
      .digest("hex");
    const xVerify = `${sha256}###${this.saltIndex}`;

    try {
      const response = await axios.post(
        `${this.baseUrl}/pg/v1/pay`,
        { request: base64Payload },
        {
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": xVerify,
            "X-MERCHANT-ID": this.merchantId,
          },
        }
      );

      if (response.data.success) {
        return {
          success: true,
          redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
        };
      } else {
        return { success: false, error: response.data.code };
      }
    } catch (err: any) {
      console.error("PhonePe error:", err?.response?.data || err.message);
      return { success: false, error: err.message };
    }
  }
}
