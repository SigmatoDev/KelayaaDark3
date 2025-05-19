import mongoose from "mongoose";

const PageContentSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.PageContent ||
  mongoose.model("PageContent", PageContentSchema);
