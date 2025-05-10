import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import CustomDesignModel from "@/lib/models/CustomDesignModel";
import { serialize } from "@/lib/utils";

// Get all custom designs (admin only)
export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: "unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const designs = await CustomDesignModel.find()
      .sort({ createdAt: -1 })
      .lean();

    return Response.json(serialize(designs));
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}) as any;
