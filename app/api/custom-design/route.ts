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
      contactNumber: data.contactNumber,
      customImage: data.customImage,
      // ... other fields for debugging
    });

    // Validate required fields
    const requiredFields = [
      'gender',
      'contactNumber', // Make sure this is required
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

    // Create custom design object
    const customDesign = new CustomDesignModel({
      orderNumber: `CD${nanoid(8).toUpperCase()}`,
      user: req.auth.user.id,
      contactNumber: data.contactNumber, // Ensure this is being set
      customImage: data.customImage, // Store the full image URL
      gender: data.gender,
      designType: data.designType,
      metalType: data.metalType,
      materialKarat: data.materialKarat,
      budget: data.budget,
      designMethod: data.designMethod,
      stoneType: data.stoneType || null,
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
      contactNumber: customDesign.contactNumber,
      customImage: customDesign.customImage,
    });

    const savedDesign = await customDesign.save();
    return Response.json({ 
      success: true, 
      design: serialize(savedDesign)
    }, { status: 201 });
  } catch (error: any) {
    console.error('Custom design creation error:', error);
    return Response.json({ 
      message: error.message || "Failed to create custom design",
      error: error.errors || error.message
    }, { status: 500 });
  }
}) as any;

// Update the GET route to include image and contact number in the response
export const GET = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json({ message: "unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const designs = await CustomDesignModel.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    // Add image URL to the response
    const designsWithImageUrls = designs.map(design => ({
      ...design,
      imageUrl: design.customImage,
      contactNumber: design.contactNumber
    }));

    return Response.json(serialize(designsWithImageUrls));
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}) as any; 