import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import CustomDesignModel from "@/lib/models/CustomDesignModel";
import { serialize } from "@/lib/utils";

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user) {
    return Response.json({ message: "unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await req.json();
    
    const savedDesign = new CustomDesignModel({
      ...data,
      user: req.auth.user.id,
      status: 'draft',
      createdAt: new Date(),
      orderNumber: null // Will be assigned when actually submitted
    });

    const saved = await savedDesign.save();
    return Response.json({ 
      success: true, 
      design: serialize(saved)
    }, { status: 201 });
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}) as any;

export const GET = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json({ message: "unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const savedDesigns = await CustomDesignModel.find({ 
      user: req.auth.user.id,
      status: 'draft'
    }).sort({ createdAt: -1 }).lean();

    return Response.json(serialize(savedDesigns));
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}) as any; 