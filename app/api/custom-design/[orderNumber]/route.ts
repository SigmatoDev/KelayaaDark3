// import { auth } from "@/lib/auth";
// import dbConnect from "@/lib/dbConnect";
// import CustomDesignModel from "@/lib/models/CustomDesignModel";
// import { serialize } from "@/lib/utils";

// export const GET = auth(async (req: any, { params }: { params: { orderNumber: string } }) => {
//   if (!req.auth) {
//     return Response.json({ message: "unauthorized" }, { status: 401 });
//   }

//   try {
//     await dbConnect();
//     const order = await CustomDesignModel.findOne({
//       orderNumber: params.orderNumber,
//       user: req.auth.user._id
//     }).lean();

//     if (!order) {
//       return Response.json({ message: "Order not found" }, { status: 404 });
//     }

//     return Response.json(serialize(order));
//   } catch (error: any) {
//     return Response.json({ message: error.message }, { status: 500 });
//   }
// }) as any; 


import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import CustomDesignModel from "@/lib/models/CustomDesignModel";
import { serialize } from "@/lib/utils";

export const GET = (async (req: any, ctx: any) => {
  // First authenticate the request
  const authResult = await auth(req, ctx);
  
  // If auth returns a Response, it means authentication failed
  if (authResult instanceof Response) {
    return authResult;
  }
  
  // Check if user is authenticated
  if (!req.auth) {
    return Response.json({ message: "unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const orderNumber = ctx.params.orderNumber;
    
    const order = await CustomDesignModel.findOne({
      orderNumber,
      user: req.auth.user._id
    }).lean();

    if (!order) {
      return Response.json({ message: "Order not found" }, { status: 404 });
    }

    return Response.json(serialize(order));
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}) as any;