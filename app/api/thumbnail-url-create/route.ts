import { NextResponse } from "next/server";
import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";
import fetch from "node-fetch";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/lib/models/ProductModel";
import SetsProductModel from "@/lib/models/SetsProductsModel";
import BanglesProductModel from "@/lib/models/BanglesProductSchema";
import BeadsProductModel from "@/lib/models/BeadsProductModel";

// Initialize AWS S3 client and environment variables
const {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_NAME,
  MONGODB_URI,
} = process.env;

if (
  !AWS_REGION ||
  !AWS_ACCESS_KEY_ID ||
  !AWS_SECRET_ACCESS_KEY ||
  !AWS_S3_BUCKET_NAME ||
  !MONGODB_URI
) {
  throw new Error(
    "Missing AWS or MongoDB environment variables. Please check your .env file."
  );
}

// Initialize S3 client
const s3 = new S3Client({
  region: AWS_REGION!,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!,
  },
});

dbConnect();

// Function to resize and copy image to 'thumbnail-images' folder and update the database
export async function GET(req: Request) {
  try {
    console.log(
      "🔄 Creating 'thumbnail-images' folder and copying images with resizing..."
    );

    const bucketName = AWS_S3_BUCKET_NAME!;
    const sourceFolder = "uploads/"; // The existing folder containing your images
    const destinationFolder = "thumbnail-images/"; // The new folder for thumbnails

    let images: { filename: string; url: string }[] = [];
    let isTruncated = true;
    let continuationToken: string | undefined;

    while (isTruncated) {
      try {
        const command = new ListObjectsV2Command({
          Bucket: bucketName,
          Prefix: sourceFolder, // Only get files from the "uploads/" folder
          MaxKeys: 1000, // Max limit for S3 request
          ContinuationToken: continuationToken, // Handle pagination
        });

        const response = await s3.send(command);

        if (response.Contents) {
          // Iterate over each file in the "uploads/" folder
          for (const file of response.Contents) {
            const sourceKey = file.Key!;
            const fileExtension = sourceKey.split(".").pop()?.toLowerCase(); // Convert extension to lowercase
            const destinationKey = `${destinationFolder}${sourceKey.split("/").pop()}`;

            // Fetch the image from S3
            const imageUrl = `https://${bucketName}.s3.${AWS_REGION}.amazonaws.com/${sourceKey}`;
            console.log(`Fetching image from S3: ${imageUrl}`);
            const res = await fetch(imageUrl);
            const buffer = await res.buffer();

            // Resize the image using sharp
            let resizedImageBuffer: Buffer;
            console.log(`Resizing image ${sourceKey}...`);

            if (fileExtension === "jpg" || fileExtension === "jpeg") {
              resizedImageBuffer = await sharp(buffer)
                .resize(300) // Resize width to 300px
                .jpeg({ quality: 85 }) // Convert to JPEG with quality 85
                .toBuffer();
            } else if (fileExtension === "png") {
              resizedImageBuffer = await sharp(buffer)
                .resize(300) // Resize width to 300px
                .png({ quality: 85 }) // Convert to PNG with quality 85
                .toBuffer();
            } else if (fileExtension === "webp") {
              resizedImageBuffer = await sharp(buffer)
                .resize(300) // Resize width to 300px
                .webp({ quality: 85 }) // Convert to WebP with quality 85
                .toBuffer();
            } else {
              resizedImageBuffer = await sharp(buffer)
                .resize(300) // Resize width to 300px
                .toBuffer(); // Default resizing for other image types
            }

            // Upload the resized image to the "thumbnail-images" folder
            const putCommand = new PutObjectCommand({
              Bucket: bucketName,
              Key: destinationKey,
              Body: resizedImageBuffer,
              ContentType: `image/${fileExtension}`, // Dynamically set the content type
            });

            console.log(`Uploading resized image to S3: ${destinationKey}`);
            await s3.send(putCommand);

            // Add image details to the response
            images.push({
              filename: destinationKey,
              url: `https://${bucketName}.s3.${AWS_REGION}.amazonaws.com/${destinationKey}`,
            });

            // Now update the product's thumbnail_url field in the database
            const productSlug = sourceKey.split("/")[1]; // Assuming the filename is the product slug or an identifier

            console.log(`Updating product with thumbnail URL: ${imageUrl}`);
            await ProductModel.updateOne(
              { image: imageUrl }, // Search for product by image URL
              {
                $set: {
                  thumbnail_url: `https://${bucketName}.s3.${AWS_REGION}.amazonaws.com/${destinationKey}`,
                },
              }
            );
            await SetsProductModel.updateOne(
              { image: imageUrl },
              {
                $set: {
                  thumbnail_url: `https://${bucketName}.s3.${AWS_REGION}.amazonaws.com/${destinationKey}`,
                },
              }
            );
            await BanglesProductModel.updateOne(
              { image: imageUrl },
              {
                $set: {
                  thumbnail_url: `https://${bucketName}.s3.${AWS_REGION}.amazonaws.com/${destinationKey}`,
                },
              }
            );
            await BeadsProductModel.updateOne(
              { image: imageUrl },
              {
                $set: {
                  thumbnail_url: `https://${bucketName}.s3.${AWS_REGION}.amazonaws.com/${destinationKey}`,
                },
              }
            );
          }
        }

        isTruncated = response.IsTruncated ?? false; // If false, break the loop
        continuationToken = response.NextContinuationToken; // Fetch next batch if available
      } catch (s3Error) {
        console.error("⚠️ S3 Fetch, Resize or Upload Error:", s3Error);
        return NextResponse.json(
          { error: "Failed to retrieve, resize, or upload images to S3" },
          { status: 500 }
        );
      }
    }

    console.log(
      `✅ Successfully resized and copied images to 'thumbnail-images' folder and updated database.`
    );

    return NextResponse.json({ images }, { status: 200 });
  } catch (error) {
    console.error("❌ Unexpected Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
