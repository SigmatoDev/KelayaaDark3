// app/api/page-content/route.ts
import { NextResponse } from "next/server";
import PageContent from "@/models/PageContent";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  const data = slug
    ? await PageContent.findOne({ slug })
    : await PageContent.find();

  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  await dbConnect();
  const { slug, content } = await req.json();

  const updated = await PageContent.findOneAndUpdate(
    { slug },
    { content, updatedAt: new Date() },
    { new: true }
  );

  return NextResponse.json(updated);
}
