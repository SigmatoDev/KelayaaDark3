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

    console.log(`Admin: Found ${designs.length} custom designs`);
    
    // Log each design for debugging
    designs.forEach((design, index) => {
      console.log(`Design ${index + 1}:`, {
        orderNumber: design.orderNumber,
        userId: design.user?._id,
        userName: design.user?.name,
        status: design.status,
        createdAt: design.createdAt
      });
    });

    return Response.json(serialize(designs));
  } catch (error: any) {
    console.error("Admin: Error fetching custom designs:", {
      message: error.message,
      stack: error.stack
    });
    return Response.json({ 
      message: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}) as any; 