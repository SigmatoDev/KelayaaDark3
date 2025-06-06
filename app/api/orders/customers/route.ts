import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";

export const GET = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json(
      { message: "unauthorized" },
      {
        status: 401,
      }
    );
  }
  const { user } = req.auth;
  await dbConnect();
  const orders = await OrderModel.find().sort({
    createdAt: -1,
  });
  return Response.json(orders);
});
