import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import CustomDesignModel from "@/lib/models/CustomDesignModel";
import { serialize } from "@/lib/utils";

// Get single custom design (admin only)
export const GET = auth(async (req: any, { params }: { params: { orderNumber: string } }) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: "unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const design = await CustomDesignModel.findOne({ orderNumber: params.orderNumber })
      .populate('user', 'name email')
      .lean();

    if (!design) {
      return Response.json({ message: "Design not found" }, { status: 404 });
    }

    return Response.json(serialize(design));
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}) as any;

// Update custom design status (admin only)
export const PUT = auth(async (req: any, { params }: { params: { orderNumber: string } }) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: "unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { status, adminNotes } = await req.json();

    const design = await CustomDesignModel.findOne({ orderNumber: params.orderNumber });
    if (!design) {
      return Response.json({ message: "Design not found" }, { status: 404 });
    }

    design.status = status;
    if (adminNotes) design.adminNotes = adminNotes;
    design.updatedAt = new Date();

    const updatedDesign = await design.save();
    return Response.json(serialize(updatedDesign));
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}) as any; 