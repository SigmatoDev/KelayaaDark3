import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import FAQModel from "@/lib/models/FaqModel";

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const faqs = await FAQModel.find();
  return Response.json(faqs);
}) as any;

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await req.text(); // Handle raw body data
    const parsedBody = JSON.parse(body); // Parse the JSON string

    console.log("Received FAQ data:", parsedBody); // Log for debugging

    // Check if the necessary fields are present
    if (!parsedBody.question || !parsedBody.answer) {
      return Response.json(
        { message: "Invalid input, expected 'question' and 'answer'." },
        { status: 400 }
      );
    }

    // Prepare the FAQ data
    const { _id, question, answer } = parsedBody;

    // If _id exists, we are updating an existing FAQ
    if (_id) {
      const updatedFAQ = await FAQModel.findOneAndUpdate(
        { _id },
        { question, answer },
        { new: true } // Return the updated FAQ
      );

      if (!updatedFAQ) {
        return Response.json(
          { message: "FAQ not found or unable to update." },
          { status: 404 }
        );
      }

      return Response.json(
        { message: "FAQ updated successfully", faq: updatedFAQ },
        { status: 200 }
      );
    }

    // If _id doesn't exist, create a new FAQ
    const newFAQ = new FAQModel({ question, answer });
    const savedFAQ = await newFAQ.save(); // Save new FAQ to the database

    return Response.json(
      { message: "FAQ created successfully", faq: savedFAQ },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error processing FAQ:", err);
    return Response.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}) as any;

// DELETE API to remove FAQ by _id
export const DELETE = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const { _id } = await req.json(); // Get _id from the request body
    if (!_id) {
      return Response.json(
        { message: "Invalid input, expected '_id'." },
        { status: 400 }
      );
    }

    // Find and delete FAQ by _id
    const deletedFAQ = await FAQModel.findByIdAndDelete(_id);

    if (!deletedFAQ) {
      return Response.json({ message: "FAQ not found." }, { status: 404 });
    }

    return Response.json(
      { message: "FAQ deleted successfully." },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error deleting FAQ:", err);
    return Response.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}) as any;
