import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getPhonePeAccessToken } from "@/lib/getPhonePeAccesstoken";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { merchantOrderId } = await req.json();

    const { access_token: accessToken, token_type } =
      await getPhonePeAccessToken();
    const baseUrl = process.env.PHONEPE_BASE_URL;

    const url = `${baseUrl}/checkout/v2/order/${merchantOrderId}/status?details=false&errorContext=true`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token_type} ${accessToken}`,
      },
    });

    const result = response.data;

    console.log("PhonePe Status Response:", result);

    if (result.state === "COMPLETED") {
      return NextResponse.json(
        {
          status: "COMPLETED",
          transactionId: result?.paymentDetails[0]?.transactionId,
          result: result,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: result.state,
          referenceId: result?.paymentDetails[0]?.transactionId || null,
          result: result,
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
