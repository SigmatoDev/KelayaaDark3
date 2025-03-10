import { NextApiRequest, NextApiResponse } from "next";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import formidable, { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import util from "util";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Helper function to parse form data
const parseForm = util.promisify((req: NextApiRequest, callback: any) => {
  const form = new IncomingForm({ uploadDir: "/tmp", keepExtensions: true });
  form.parse(req, callback);
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Parse form data to get uploaded files
    const { files } = (await parseForm(req)) as { files: formidable.Files };

    if (!files || !files.files) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const uploadedFiles = Array.isArray(files.files)
      ? files.files
      : [files.files];

    // Upload each file to S3
    const uploadResults = await Promise.all(
      uploadedFiles.map(async (file: any) => {
        const fileStream = fs.createReadStream(file.filepath);
        const fileName = path.basename(file.originalFilename || file.filepath);
        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: `uploads/${fileName}`, // Preserve original file name
          Body: fileStream,
          ContentType: file.mimetype,
        };

        await s3.send(new PutObjectCommand(params));

        fs.unlinkSync(file.filepath); // Remove temp file after upload
        return { fileName, status: "Uploaded" };
      })
    );

    res
      .status(200)
      .json({ message: "Files uploaded successfully", uploadResults });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload files" });
  }
}

// Disable Next.js bodyParser to allow file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};
