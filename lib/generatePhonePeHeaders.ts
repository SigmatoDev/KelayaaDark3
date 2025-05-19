// lib/phonepe.ts
import crypto from "crypto";

export function generatePhonePeHeaders(payload: string) {
  const saltKey = process.env.PHONEPE_SALT_KEY!;
  const saltIndex = process.env.PHONEPE_SALT_INDEX!;
  const base64Payload = Buffer.from(payload).toString("base64");

  const dataToSign = base64Payload + "/pg/v1/pay" + saltKey;
  const sha256 = crypto.createHash("sha256").update(dataToSign).digest("hex");
  const xVerify = `${sha256}###${saltIndex}`;

  return {
    base64Payload,
    xVerify,
  };
}
