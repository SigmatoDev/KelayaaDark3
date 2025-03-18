import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import CustomDesignModel from "@/lib/models/CustomDesignModel";
import { serialize } from "@/lib/utils";

// Get all custom designs (admin only)
export const GET = auth(async (req: any) => {
  console.log("Starting custom designs fetch...");
  
  if (!req.auth || !req.auth.user?.isAdmin) {
    console.log("Unauthorized access attempt:", req.auth?.user);
    return Response.json({ message: "unauthorized" }, { status: 401 });
  }

  try {
    console.log("Connecting to database...");
    await dbConnect();
    
    console.log("Admin: Fetching all custom designs...");
    const designs = await CustomDesignModel.find()
      .populate('user', 'name email') // Populate user details
      .sort({ createdAt: -1 })
      .lean();

    console.log("Found designs:", designs.map(d => ({
      orderNumber: d.orderNumber,
      customImage: d.customImage,
      contactNumber: d.contactNumber
    })));

    return Response.json(serialize(designs));
  } catch (error: any) {
    console.error("Error fetching designs:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}) as any; 