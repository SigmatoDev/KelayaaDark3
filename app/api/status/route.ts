import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getPhonePeAccessToken } from "@/lib/getPhonePeAccesstoken";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { id: merchantOrderId } = await req.json();

    const { access_token: accessToken, token_type } =
      await getPhonePeAccessToken();
    const baseUrl = process.env.PHONEPE_BASE_URL || "https://api.phonepe.com";

    const url = `${baseUrl}/apis/pg/checkout/v2/order/${merchantOrderId}/status`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `${token_type || "O-Bearer"} ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const result = response.data;

    console.log("PhonePe Status Response:", result);

    if (result.state === "COMPLETED") {
      return NextResponse.json(
        {
          status: "COMPLETED",
          transactionId: result.data?.paymentDetails[0]?.transactionId,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: result.state,
          referenceId: result.data?.paymentDetails[0]?.transactionId || null,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error(
      "Error in OAuth payment status check:",
      error?.response?.data || error.message
    );
    return NextResponse.json(
      {
        status: "SERVER_ERROR",
        referenceId: null,
      },
      { status: 500 }
    );
  }
}
