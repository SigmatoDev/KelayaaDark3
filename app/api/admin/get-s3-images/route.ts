import { NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

// Validate AWS Credentials
const {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_NAME,
} = process.env;

if (
  !AWS_REGION ||
  !AWS_ACCESS_KEY_ID ||
  !AWS_SECRET_ACCESS_KEY ||
  !AWS_S3_BUCKET_NAME
) {
  throw new Error(
    "Missing AWS environment variables. Please check your .env file."
  );
}

// Initialize S3 Client
const s3 = new S3Client({
  region: AWS_REGION!,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: Request) {
  try {
    console.log("🔄 Fetching images from S3...");

    const bucketName = AWS_S3_BUCKET_NAME!;
    const bucketUrl = `https://${bucketName}.s3.${AWS_REGION}.amazonaws.com/`;

    let images: { filename: string; url: string }[] = [];
    let isTruncated = true;
    let continuationToken: string | undefined;

    while (isTruncated) {
      try {
        const command = new ListObjectsV2Command({
          Bucket: bucketName,
          MaxKeys: 1000, // Max limit for S3 request
          ContinuationToken: continuationToken, // Handle pagination
        });

        const response = await s3.send(command);

        if (response.Contents) {
          images.push(
            ...response.Contents.map((file) => ({
              filename: file.Key!,
              url: `${bucketUrl}${file.Key}`,
            }))
          );
        }

        isTruncated = response.IsTruncated ?? false; // If false, break the loop
        continuationToken = response.NextContinuationToken; // Fetch next batch if available
      } catch (s3Error) {
        console.error("⚠️ S3 Fetch Error:", s3Error);
        return NextResponse.json(
          { error: "Failed to retrieve images from S3" },
          { status: 500 }
        );
      }
    }

    console.log(`✅ Fetched ${images.length} images from S3.`);

    return NextResponse.json({ images }, { status: 200 });
  } catch (error) {
    console.error("❌ Unexpected Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
