import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import formidable, { File } from "formidable";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { Readable } from "stream";
import { IncomingMessage } from "http";

// **AWS S3 Client**
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// **Helper: Convert NextRequest to IncomingMessage-compatible Readable**
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

  // **Extend Readable to mimic IncomingMessage**
  const incomingMessage = Object.assign(stream, {
    headers: Object.fromEntries(req.headers.entries()), // Convert Headers object to plain object
    method: req.method,
    url: req.nextUrl.pathname,
  }) as IncomingMessage;

  return incomingMessage;
}

// **Helper: Parse Form Data using Formidable**
async function parseForm(req: NextRequest): Promise<{ files: File[] }> {
  const incomingMessage = await convertToIncomingMessage(req);

  const form = formidable({
    uploadDir: os.tmpdir(),
    keepExtensions: true,
    multiples: true,
    maxTotalFileSize: 3 * 1024 * 1024 * 1024, // 🔥 Increase to 3GB
    maxFileSize: 1 * 1024 * 1024 * 1024, // 🔥 Allow up to 1GB per file
  });

  // return new Promise((resolve, reject) => {
  //   form.parse(incomingMessage, (err, fields, files) => {
  //     if (err) return reject(err);

  //     const uploadedFiles: File[] = Array.isArray(files.files)
  //       ? files.files.filter((f): f is File => f !== undefined)
  //       : files.files
  //         ? [files.files]
  //         : [];

  //     resolve({ files: uploadedFiles });
  //   });
  // });

  return new Promise((resolve, reject) => {
    form.parse(
      incomingMessage,
      (err: any, fields: formidable.Fields, files: formidable.Files) => {
        if (err) return reject(err);

        const uploadedFiles: File[] = Array.isArray(files.files)
          ? files.files.filter((f): f is File => f !== undefined)
          : files.files
            ? [files.files as File]
            : [];

        resolve({ files: uploadedFiles });
      }
    );
  });
}

// **Handle File Upload API Route**
export async function POST(req: NextRequest) {
  try {
    console.log("⏳ Parsing form...");
    const { files } = await parseForm(req);

    if (!files.length) {
      console.error("❌ No files uploaded");
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    console.log(`✅ ${files.length} file(s) received`);

    // **Upload to S3**
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        console.log(`📤 Uploading file: ${file.originalFilename}`);

        const fileStream = await fs.readFile(file.filepath);
        const fileName = path.basename(file.originalFilename || file.filepath);

        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: `uploads/${fileName}`,
          Body: fileStream,
          ContentType: file.mimetype || "application/octet-stream",
        };

        await s3.send(new PutObjectCommand(params));
        await fs.unlink(file.filepath); // ✅ Delete temp file

        console.log(`✅ Uploaded: ${fileName}`);
        return { fileName, status: "Uploaded" };
      })
    );

    return NextResponse.json(
      { message: "Files uploaded successfully", uploadResults },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic"; // ✅ Use the new Next.js API Route config

// **Disable Next.js default body parser**
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
