import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import CustomDesignModel from "@/lib/models/CustomDesignModel";
import { serialize } from "@/lib/utils";
import { nanoid } from 'nanoid';

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user) {
    return Response.json({ message: "unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await req.json();
    
    console.log('Received form data:', {
      gender: data.gender,
      contactNumber: data.contactNumber,
      customImage: data.customImage,
      designType: data.designType,
      metalType: data.metalType,
      budget: data.budget,
    });
    
    console.log('Auth user:', {
      id: req.auth.user.id,
      name: req.auth.user.name,
      email: req.auth.user.email
    });

    // Validate phone number
    if (!data.contactNumber) {
      return Response.json({ 
        message: "Contact number is required" 
      }, { status: 400 });
    }

    // Validate required fields
    const requiredFields = [
      'gender',
      'contactNumber',
      'designType',
      'metalType',
      'materialKarat',
      'budget',
      'designMethod',
      'occasion',
      'size',
      'timeline',
      'termsAccepted',
      'customizationAccepted'
    ];

    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      return Response.json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Calculate prices
    const subtotal = data.budget;
    const gst = subtotal * 0.18;
    const deliveryCharge = 0;
    const totalPayable = subtotal + gst + deliveryCharge;

    // Generate order number
    const orderNumber = `CD${nanoid(8).toUpperCase()}`;

    // Create custom design object
    const customDesign = new CustomDesignModel({
      orderNumber: `CD${nanoid(8).toUpperCase()}`,
      user: req.auth.user.id,
      gender: data.gender,
      contactNumber: data.contactNumber.toString(),
      designType: data.designType,
      metalType: data.metalType,
      materialKarat: data.materialKarat,
      budget: data.budget,
      designMethod: data.designMethod,
      stoneType: data.stoneType || null,
      customImage: data.customImage || null,
      occasion: data.occasion,
      size: data.size,
      additionalDetails: data.additionalDetails || "",
      timeline: data.timeline,
      termsAccepted: data.termsAccepted,
      customizationAccepted: data.customizationAccepted,
      subtotal: data.budget,
      gst: data.budget * 0.18,
      deliveryCharge: 0,
      totalPayable: data.budget + (data.budget * 0.18),
      status: 'pending',
      createdAt: new Date(),
      specifications: {
        gender: data.gender,
        size: data.size.toString(),
        occasion: data.occasion,
        stoneType: data.stoneType || 'no stone',
        materialKarat: data.materialKarat.toString(),
        designMethod: data.designMethod
      }
    });

    console.log('Saving custom design with data:', {
      orderNumber: customDesign.orderNumber,
      contactNumber: customDesign.contactNumber,
      customImage: customDesign.customImage
    });

    const savedDesign = await customDesign.save();
    console.log('Successfully saved custom design:', {
      id: savedDesign._id,
      orderNumber: savedDesign.orderNumber,
      userId: savedDesign.user
    });

    return Response.json({ 
      success: true, 
      design: serialize(savedDesign)
    }, { status: 201 });
  } catch (error: any) {
    console.error('Custom design creation error:', error);
    console.error('Full error details:', {
      message: error.message,
      errors: error.errors,
      stack: error.stack
    });
    return Response.json({ 
      message: error.message || "Failed to create custom design",
      error: error.errors || error.message
    }, { status: 500 });
  }
}) as any;

export const GET = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json({ message: "unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    console.log('Fetching custom designs for user:', req.auth.user.id);
    
    const designs = await CustomDesignModel.find({ user: req.auth.user.id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Found ${designs.length} designs for user`);
    
    return Response.json(serialize(designs));
  } catch (error: any) {
    console.error('Error fetching user designs:', error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}) as any; 