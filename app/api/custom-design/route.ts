import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { Readable } from "stream";
import { IncomingMessage } from "http";
import formidable, { File, Fields } from "formidable";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import CustomDesignModel from "@/lib/models/CustomDesignModel";
import { NextRequest, NextResponse } from "next/server";
import sendAdminEmail from "@/utility/sendEmail";

// 🔧 AWS S3 Client Setup
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// 🔄 Convert NextRequest to IncomingMessage
async function convertToIncomingMessage(
  req: NextRequest
): Promise<IncomingMessage> {
  const reader = req.body?.getReader();
  const stream = new Readable({
    async read() {
      if (!reader) return this.push(null);
      const { done, value } = await reader.read();
      if (done) return this.push(null);
      this.push(value);
    },
  });

  const incomingMessage = Object.assign(stream, {
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
    url: req.nextUrl.pathname,
  }) as IncomingMessage;

  return incomingMessage;
}

// 📦 Parse form data
async function parseForm(
  req: NextRequest
): Promise<{ fields: Fields; files: File[] }> {
  const incomingMessage = await convertToIncomingMessage(req);

  const form = formidable({
    uploadDir: os.tmpdir(),
    keepExtensions: true,
    multiples: true,
    maxTotalFileSize: 3 * 1024 * 1024 * 1024,
    maxFileSize: 1 * 1024 * 1024 * 1024,
  });

  return new Promise((resolve, reject) => {
    form.parse(incomingMessage, (err, fields, files) => {
      if (err) return reject(err);

      const uploadedFiles: File[] = Array.isArray(files.customImage)
        ? files.customImage
        : files.customImage
          ? [files.customImage as File]
          : [];

      resolve({ fields, files: uploadedFiles });
    });
  });
}

// 📤 Upload image to S3
const uploadImageToS3 = async (file: File) => {
  if (!file) {
    console.warn("⚠️ No file provided to uploadImageToS3");
    return "";
  }

  console.log("📤 Preparing to upload image to S3");

  // Read the temp file
  const fileStream = await fs.readFile(file.filepath).catch((err) => {
    console.error("❌ Error reading temp file:", err);
    throw err;
  });

  // Use the original file name for the S3 key, ensuring it's sanitized if necessary
  const originalFileName = file.newFilename || "default-name";
  console.log("originalFileName", originalFileName);
  const sanitizedFileName = path.basename(originalFileName); // Remove any path components
  console.log("sanitizedFileName", sanitizedFileName);

  // Construct the S3 key
  const s3Key = `kelayaa-custom-designs-request/${sanitizedFileName}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: s3Key,
    Body: fileStream,
    ContentType: file.mimetype || "application/octet-stream",
  };

  console.log("📦 S3 Upload Params:", params);

  try {
    await s3.send(new PutObjectCommand(params));
    console.log("✅ File uploaded to S3");
  } catch (s3Err) {
    console.error("❌ S3 upload failed:", s3Err);
    throw s3Err;
  }

  // Delete the temporary file after upload
  try {
    await fs.unlink(file.filepath);
    console.log("🗑️ Temporary file deleted");
  } catch (unlinkErr) {
    console.warn("⚠️ Failed to delete temp file:", unlinkErr);
  }

  // Return the file URL
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
};

// 🚀 POST Handler
export const POST = auth(async (req: NextRequest) => {
  try {
    await dbConnect();

    const { fields, files } = await parseForm(req);
    console.log("📋 Fields:", fields);
    console.log("📂 Files:", files);

    const normalizedFields = Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [
        key,
        Array.isArray(value) ? value[0] : value,
      ])
    );

    const customImage = files?.[0];
    if (!customImage) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    const customImageUrl = await uploadImageToS3(customImage);
    const designData = { ...normalizedFields, customImage: customImageUrl };

    const design = await CustomDesignModel.create(designData);

    // Send an email notification to admin
    await sendAdminEmail(designData);

    return NextResponse.json(
      { message: "Design saved successfully", design },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error saving design:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
});

// 🧩 Disable body parser
export const config = {
  api: {
    bodyParser: false,
  },
};
