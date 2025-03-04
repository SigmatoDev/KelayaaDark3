"use client";
import { useState } from "react";
import { Sparkles, Phone, Image, CheckCircle, Package } from "lucide-react";

interface FormDataState {
  name: string;
  email: string;
  phone: string;
  description: string;
  file: File | null;
}

const CustomDesign: React.FC = () => {
  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    email: "",
    phone: "",
    description: "",
    file: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Your custom design request has been submitted!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Create Your Custom Jewelry
      </h1>
      <p className="text-center text-gray-600 mb-8">
        We bring your dream jewelry to life! Whether it's a unique engagement
        ring, a special gift, or a personal design, our expert artisans will
        craft it with precision and care. Follow these steps to start your
        custom jewelry journey.
      </p>

      {/* Steps */}
      <div className="space-y-8 mb-12">
        {[
          {
            step: "1",
            title: "Submit Your Design Idea",
            description: "Upload an image or describe your vision in detail.",
            icon: <Image className="text-blue-500" size={28} />,
          },
          {
            step: "2",
            title: "Consultation with Our Designers",
            description:
              "We’ll refine your idea, discuss materials, and provide an estimate.",
            icon: <Phone className="text-green-500" size={28} />,
          },
          {
            step: "3",
            title: "3D Rendering & Approval",
            description:
              "See a digital preview before we proceed with crafting.",
            icon: <Sparkles className="text-yellow-500" size={28} />,
          },
          {
            step: "4",
            title: "Production & Crafting",
            description:
              "Our artisans bring your design to life with precision.",
            icon: <CheckCircle className="text-purple-500" size={28} />,
          },
          {
            step: "5",
            title: "Delivery & Unboxing",
            description: "Receive your unique piece, beautifully packaged.",
            icon: <Package className="text-red-500" size={28} />,
          },
        ].map((step, index) => (
          <div
            key={index}
            className="relative bg-gray-100 p-6 rounded-lg flex justify-between items-center"
          >
            <div className="absolute -top-4 -left-4 w-12 h-12 flex items-center justify-center bg-pink-600 text-white text-xl font-bold rounded-full">
              {step.step}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{step.title}</h2>
              <p className="text-gray-600">{step.description}</p>
            </div>
            {step.icon}
          </div>
        ))}
      </div>

      {/* Form Section */}
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">
          Start Your Custom Design
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            name="description"
            placeholder="Describe your custom jewelry design"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          ></textarea>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomDesign;
