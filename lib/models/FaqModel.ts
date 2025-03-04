import mongoose from "mongoose";

export type FAQ = {
  _id: string;
  question: string;
  answer: string;
};

const FAQSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const FAQModel = mongoose.models?.FAQ || mongoose.model("FAQ", FAQSchema);

export default FAQModel;
