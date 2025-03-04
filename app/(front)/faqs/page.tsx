"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What types of jewelry does Kelayaa offer?",
    answer:
      "Kelayaa offers a wide range of jewelry, including rings, necklaces, bracelets, and custom-designed pieces tailored to your preferences.",
  },
  {
    question: "Do you provide custom jewelry design services?",
    answer:
      "Yes, we specialize in custom jewelry design, allowing you to create unique pieces that match your style and preferences.",
  },
  {
    question: "What materials do you use for your jewelry?",
    answer:
      "We use high-quality materials such as gold, silver, platinum, and ethically sourced gemstones in our jewelry.",
  },
  {
    question: "How long does it take to create a custom jewelry piece?",
    answer:
      "The timeline for custom jewelry varies, but typically it takes between 2-4 weeks, depending on the complexity of the design.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we offer worldwide shipping. Shipping charges and delivery times vary depending on the destination.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-300">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center py-4 text-left text-lg font-medium focus:outline-none"
            >
              {faq.question}
              {openIndex === index ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
            {openIndex === index && (
              <p className="p-4 bg-gray-100 rounded-lg">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
