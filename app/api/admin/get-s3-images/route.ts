import { NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET() {
  try {
    console.log("Fetching images from S3...");

    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const bucketUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`;

    if (!bucketName) {
      return NextResponse.json(
        { error: "S3 bucket name is missing" },
        { status: 500 }
      );
    }

    const command = new ListObjectsV2Command({ Bucket: bucketName });
    const response = await s3.send(command);

    const imageFiles = response.Contents
      ? response.Contents.map((file) => ({
          filename: file.Key,
          url: `${bucketUrl}${file.Key}`,
        }))
      : [];

    console.log("Fetched Images:", imageFiles);

    return NextResponse.json({ images: imageFiles }, { status: 200 });
  } catch (error) {
    console.error("Error fetching S3 images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images from S3" },
      { status: 500 }
    );
  }
}
