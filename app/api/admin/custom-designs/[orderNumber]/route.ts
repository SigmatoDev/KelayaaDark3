// import { auth } from "@/lib/auth";
// import dbConnect from "@/lib/dbConnect";
// import CustomDesignModel from "@/lib/models/CustomDesignModel";
// import { serialize } from "@/lib/utils";

// // Get single custom design (admin only)
// export const GET = auth(async (req: any, { params }: { params: { orderNumber: string } }) => {
//   if (!req.auth || !req.auth.user?.isAdmin) {
//     return Response.json({ message: "unauthorized" }, { status: 401 });
//   }

//   try {
//     await dbConnect();
//     console.log("Fetching design with orderNumber:", params.orderNumber);
    
//     const design = await CustomDesignModel.findOne({ orderNumber: params.orderNumber })
//       .populate('user', 'name email')
//       .lean();

//     if (!design) {
//       console.log("No design found with orderNumber:", params.orderNumber);
//       return Response.json({ message: "Design not found" }, { status: 404 });
//     }

//     // Log the entire design object
//     console.log("Full design object:", JSON.stringify(design, null, 2));

//     const serializedDesign = serialize(design);
//     console.log("Serialized design:", JSON.stringify(serializedDesign, null, 2));

//     return Response.json(serializedDesign);
//   } catch (error: any) {
//     console.error("Error fetching design:", error);
//     return Response.json({ message: error.message }, { status: 500 });
//   }
// }) as any;

// // Update custom design status (admin only)
// export const PUT = auth(async (req: any, { params }: { params: { orderNumber: string } }) => {
//   if (!req.auth || !req.auth.user?.isAdmin) {
//     return Response.json({ message: "unauthorized" }, { status: 401 });
//   }

//   try {
//     await dbConnect();
//     const { status, adminNotes } = await req.json();

//     const design = await CustomDesignModel.findOne({ orderNumber: params.orderNumber });
//     if (!design) {
//       return Response.json({ message: "Design not found" }, { status: 404 });
//     }

//     design.status = status;
//     if (adminNotes) design.adminNotes = adminNotes;
//     design.updatedAt = new Date();

//     const updatedDesign = await design.save();
//     return Response.json(serialize(updatedDesign));
//   } catch (error: any) {
//     return Response.json({ message: error.message }, { status: 500 });
//   }
// }) as any; 


import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import CustomDesignModel from "@/lib/models/CustomDesignModel";
import { serialize } from "@/lib/utils";

// Define a helper function that conforms to auth's expected signature
const withAuth = (handler: (req: any, orderNumber: string) => Promise<Response>) => {
  return auth(async (req: any, context: any) => {
    if (!req.auth || !req.auth.user?.isAdmin) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }
    
    // Extract the orderNumber parameter safely
    const orderNumber = context.params?.orderNumber;
    if (!orderNumber) {
      return Response.json({ message: "Order number required" }, { status: 400 });
    }
    
    // Call the handler with the request and orderNumber
    return handler(req, orderNumber);
  });
};

// Get single custom design (admin only)
export const GET = withAuth(async (req: any, orderNumber: string) => {
  try {
    await dbConnect();
    console.log("Fetching design with orderNumber:", orderNumber);
    
    const design = await CustomDesignModel.findOne({ orderNumber })
      .populate('user', 'name email')
      .lean();

    if (!design) {
      console.log("No design found with orderNumber:", orderNumber);
      return Response.json({ message: "Design not found" }, { status: 404 });
    }

    const serializedDesign = serialize(design);
    return Response.json(serializedDesign);
  } catch (error: any) {
    console.error("Error fetching design:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
});

// Update custom design status (admin only)
export const PUT = withAuth(async (req: any, orderNumber: string) => {
  try {
    await dbConnect();
    const { status, adminNotes } = await req.json();

    const design = await CustomDesignModel.findOne({ orderNumber });
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
});