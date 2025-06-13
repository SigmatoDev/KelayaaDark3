"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface DesignFormData {
  gender: string;
  contactNumber: string;
  countryCode: string;
  jewelryType: string;
  metalType: string;
  materialKarat: string | null;
  budget: number;
  occasion: string;
  designMethod: "details" | "upload";
  stoneType?: string;
  diamondType?: string;
  gemstoneType?: string;
  semiPreciousType?: string;
  customImage?: string;
  additionalDetails?: string;
  appointmentDate: Date | null;
  personalConsultation: boolean;
  termsAccepted: boolean;
  goldKarat: string;
}

const initialFormData: DesignFormData = {
  gender: "",
  contactNumber: "",
  countryCode: "+91",
  jewelryType: "",
  metalType: "",
  materialKarat: null,
  budget: 0,
  occasion: "",
  // productName: "",
  designMethod: "details",
  appointmentDate: null,
  personalConsultation: false,
  termsAccepted: false,
  goldKarat: "",
};

// Jewelry type images (replace with your actual paths)
const jewelryTypes = [
  { name: "Pendant", image: "/images/cd/pendant.png" },
  { name: "Ring", image: "/images/cd/ring.png" },
  { name: "Earrings", image: "/images/cd/earrings.png" },
  { name: "Necklace", image: "/images/cd/necklace.png" },
  { name: "Bracelet", image: "/images/cd/bracelet.png" },
  { name: "Bangle", image: "/images/cd/bangles.png" },
  { name: "Set", image: "/images/cd/sets.png" },
];

const earringSubtypes = [
  { name: "Studs", image: "/images/studs.webp" },
  { name: "Hoops", image: "/images/hoops.webp" },
  { name: "Drops", image: "/images/drops.webp" },
  { name: "Chandeliers", image: "/images/chandeliers.webp" },
];

const occasions = [
  "Everyday use",
  "Weddings",
  "Party wear",
  "Special occasions",
  "Gifting",
  "Other",
];

const stoneOptions = {
  diamond: ["Lab Grown", "Natural Cut"],
  gemstone: [
    "Ruby",
    "Sapphire",
    "Emerald",
    "Tourmaline",
    "Aquamarine",
    "Garnet",
    "Coral",
    "Pearl",
    "Other",
  ],
  semiPrecious: [
    "Amethyst",
    "Peridot",
    "Blue Topaz",
    "Yellow Topaz",
    "Citrine",
    "Iolite",
    "Onyx",
    "Rose Quartz",
    "Smokey Quartz",
    "Other",
  ],
};

export default function CustomDesignForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<DesignFormData>(initialFormData);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subtypes, setSubtypes] = useState<
    Array<{ name: string; image: string }>
  >([]);
  const [image, setImage] = useState<string | null>(null); // For preview
  const [file, setFile] = useState<File | null>(null); // For file upload
  const router = useRouter();

  const MAX_SIZE_MB = 1;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      setError("Image must be less than 1MB.");
      setImage(null);
      setFile(null);
      return;
    }

    console.log("Original file selected:", selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(selectedFile);
    setFile(selectedFile);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (!droppedFile) return;

    if (droppedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      setError("Image must be less than 1MB.");
      setImage(null);
      setFile(null);
      return;
    }

    console.log("Dropped file:", droppedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(droppedFile);
    setFile(droppedFile);

    // Update hidden input for FormData (optional)
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(droppedFile);
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.files = dataTransfer.files;
    }
  };

  // Handle subtype updates based on jewelry type
  // useEffect(() => {
  //   switch (formData.jewelryType) {
  //     case "Earrings":
  //       setSubtypes(earringSubtypes);
  //       break;
  //     default:
  //       setSubtypes([]);
  //   }
  // }, [formData.jewelryType]);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleChange = (field: keyof DesignFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Append form data fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, String(value));
        }
      });

      // Check if image exists and handle dynamic image type
      if (file) {
        // Append the file as a blob with the appropriate MIME type
        console.log("Uploading file:", file); // Log the file being uploaded
        formDataToSend.append("customImage", file, file.name);
      }

      const response = await fetch("/api/custom-design", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to submit design");

      toast.success("Design submitted successfully!");
      setFormData(initialFormData);
      setImage(null); // Clear preview image
      setFile(null); // Clear file data
      setShowConfirmation(true);
    } catch (error: any) {
      toast.error(error.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  // if (showConfirmation) {
  //   return (
  //     <div className="w-full min-h-screen bg-[#FFF6F6] flex items-center justify-center p-4">
  //       <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
  //         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
  //           <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
  //           <p>
  //             Your order number:{" "}
  //             <span className="font-bold">{orderNumber}</span>
  //           </p>
  //         </div>

  //         <div className="mb-6">
  //           <h3 className="text-xl font-semibold mb-4">What's Next?</h3>
  //           <p className="mb-4">
  //             We'll contact you within 24 hours to confirm your consultation
  //             details.
  //           </p>
  //           <p>
  //             Prepare any reference images or ideas for your 1-on-1 session with
  //             our designer.
  //           </p>
  //         </div>

  //         <button
  //           onClick={() => (window.location.href = "/")}
  //           className="bg-[#EC4999] text-white px-6 py-2 rounded hover:bg-[#d14284] transition"
  //         >
  //           Back to Home
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="w-full min-h-screen bg-[#FFF6F6] py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-[#f8f8f8] p-6">
          <div className="relative flex justify-between max-w-3xl mx-auto">
            <div className="absolute top-[20px] left-[12%] right-[12%] h-[1px] bg-gray-200">
              <div
                className="h-full bg-[#EC4999] transition-all"
                style={{ width: `${(step - 1) * 33.33}%` }}
              />
            </div>

            {["Share Idea", "Design", "Appointment", "Delivery"].map(
              (label, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center relative z-10"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-medium ${
                      step > index + 1
                        ? "bg-[#EC4999] text-white"
                        : step === index + 1
                          ? "bg-[#EC4999] text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > index + 1 ? (
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm ${
                      step >= index + 1 ? "text-[#EC4999]" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-[#333] mb-6">
                Start Your Custom Design
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#EC4999] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#EC4999]"
                  >
                    <option value="">Select</option>
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact
                  </label>
                  <div className="flex">
                    <select
                      value={formData.countryCode}
                      onChange={(e) =>
                        handleChange("countryCode", e.target.value)
                      }
                      className="w-20 p-3 border border-gray-300 rounded-l focus:ring-2 focus:ring-[#EC4999]"
                    >
                      <option value="+91">+91</option>
                      {/* <option value="+1">+1</option> */}
                    </select>
                    <input
                      type="tel"
                      value={formData.contactNumber}
                      onChange={(e) => {
                        // Allow only numbers and limit the length to 10 digits
                        const value = e.target.value;
                        if (/^[0-9]{0,10}$/.test(value)) {
                          // Matches numbers up to 10 digits
                          handleChange("contactNumber", value);
                        }
                      }}
                      className="flex-1 p-3 border border-gray-300 rounded-r focus:ring-2 focus:ring-[#EC4999] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#EC4999]"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Metal Type
                  </label>
                  <select
                    value={formData.metalType}
                    onChange={(e) => handleChange("metalType", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#EC4999] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#EC4999]"
                  >
                    <option value="">Select</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                  </select>
                </div>

                {/* Conditionally render the carat options for Gold */}
                {formData.metalType === "Gold" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gold Carat
                    </label>
                    <select
                      value={formData.goldKarat}
                      onChange={(e) =>
                        handleChange("goldKarat", e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#EC4999] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#EC4999]"
                    >
                      <option value="">Select Carat</option>
                      <option value="14k">14K</option>
                      <option value="18k">18K</option>
                      <option value="22k">22K</option>
                      <option value="24k">24K</option>
                    </select>
                  </div>
                )}

                {formData.metalType === "Silver" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Silver Type
                    </label>
                    <select
                      value={formData.materialKarat || ""}
                      onChange={(e) =>
                        handleChange("materialKarat", e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#EC4999] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#EC4999]"
                    >
                      <option value="">Select</option>
                      <option value="Oxidised Silver">Oxidised Silver</option>
                      <option value="Sterling Silver">Sterling Silver</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Jewelry Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {jewelryTypes.map((type) => (
                    <div
                      key={type.name}
                      onClick={() => handleChange("jewelryType", type.name)}
                      className={`cursor-pointer border-2 rounded-lg p-2 transition-all ${
                        formData.jewelryType === type.name
                          ? "border-[#EC4999] shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="relative h-[60px] w-[60px] mx-auto mb-2 flex items-center justify-center">
                        <Image
                          src={type.image}
                          alt={type.name}
                          fill
                          className="object-contain rounded"
                          sizes="60px"
                        />
                      </div>
                      <p className="text-center text-sm font-medium">
                        {type.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Occasion
                  </label>
                  <select
                    value={formData.occasion}
                    onChange={(e) => handleChange("occasion", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#EC4999] focus:border-[#EC4999]"
                  >
                    {occasions.map((occ) => (
                      <option key={occ} value={occ}>
                        {occ}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.budget || ""}
                    onChange={(e) =>
                      handleChange("budget", parseInt(e.target.value) || 0)
                    }
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#EC4999] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#EC4999]"
                    placeholder="Your budget"
                  />
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={!formData.jewelryType || !formData.metalType}
                className="w-full bg-[#EC4999] text-white py-3 rounded hover:bg-[#d14284] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-[#333] mb-6">
                Design Details
              </h2>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stone Type
                </label>
                <select
                  value={formData.stoneType || ""}
                  onChange={(e) => handleChange("stoneType", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#EC4999] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#EC4999] mb-4"
                >
                  <option value="">Select</option>
                  <option value="Diamond">Diamond</option>
                  <option value="Gemstone">Gemstone</option>
                  <option value="Semi-Precious">Semi-Precious</option>
                  <option value="None">No Stone</option>
                </select>

                {formData.stoneType === "Diamond" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Diamond Type
                    </label>
                    <select
                      value={formData.diamondType || ""}
                      onChange={(e) =>
                        handleChange("diamondType", e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-[#EC4999] focus:border-[#EC4999]"
                    >
                      {stoneOptions.diamond.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.stoneType === "Gemstone" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gemstone
                    </label>
                    <select
                      value={formData.gemstoneType || ""}
                      onChange={(e) =>
                        handleChange("gemstoneType", e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-[#EC4999] focus:border-[#EC4999]"
                    >
                      {stoneOptions.gemstone.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.stoneType === "Semi-Precious" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Semi-Precious
                    </label>
                    <select
                      value={formData.semiPreciousType || ""}
                      onChange={(e) =>
                        handleChange("semiPreciousType", e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-[#EC4999] focus:border-[#EC4999]"
                    >
                      {stoneOptions.semiPrecious.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Design Details
                </label>
                <textarea
                  value={formData.additionalDetails || ""}
                  onChange={(e) =>
                    handleChange("additionalDetails", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#EC4999] focus:border-[#EC4999] h-32"
                  placeholder="Describe your design in detail..."
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Image ({" "}
                  <span className="text-xs text-red-500">Max size: ≤ 1 MB</span>)
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
                  onDrop={handleDrop}
                  onDragOver={(event) => event.preventDefault()}
                >
                  <p className="mb-2 text-gray-500">
                    Drag & drop your image here or
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <div className="flex flex-col items-center gap-1 mt-2">
                    <label
                      htmlFor="file-upload"
                      className="bg-gray-100 px-4 py-2 rounded text-sm hover:bg-gray-200 transition cursor-pointer"
                    >
                      Browse Files
                    </label>
                  </div>

                  {/* Error message */}
                  {error && (
                    <p className="mt-2 text-sm text-red-500">{error}</p>
                  )}

                  {/* Image Preview */}
                  {image && (
                    <div className="mt-4">
                      <img
                        src={image}
                        alt="Preview"
                        className="mx-auto max-w-full max-h-40 object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="bg-[#EC4999] text-white px-6 py-2 rounded hover:bg-[#d14284] transition"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-[#333] mb-6">
                Book Your Consultation
              </h2>

              <div className="bg-[#FFF6F6] p-6 rounded-lg mb-8">
                <h3 className="text-xl font-semibold text-[#EC4999] mb-3">
                  1-on-1 Design Consultation
                </h3>
                <p className="mb-4">We'll review your design and provide:</p>
                <ul className="list-disc pl-5 mb-4 space-y-1">
                  <li>A custom sketch or CAD design</li>
                  <li>Estimated price for your piece</li>
                  <li>Expert recommendations</li>
                </ul>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Date & Time
                  </label>
                  <DatePicker
                    selected={formData.appointmentDate}
                    onChange={(date) => handleChange("appointmentDate", date)}
                    showTimeSelect
                    timeFormat="hh:mm aa" // 12-hour format with AM/PM
                    timeIntervals={30}
                    dateFormat="dd-MM-yyyy h:mm aa" // Set the date format as dd-MM-yyyy
                    minDate={
                      new Date(new Date().setDate(new Date().getDate() + 1))
                    } // Set minDate to tomorrow
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#EC4999] focus:border-[#EC4999]"
                    placeholderText="Select date and time"
                    filterTime={(time) => {
                      const hour = time.getHours();
                      return hour >= 11 && hour <= 19; // Restrict time to between 11 AM and 7 PM
                    }}
                  />
                </div>

                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="personalConsultation"
                    checked={formData.personalConsultation}
                    onChange={(e) =>
                      handleChange("personalConsultation", e.target.checked)
                    }
                    className="mr-2 h-5 w-5 text-[#EC4999] focus:ring-[#EC4999] border-gray-300 rounded"
                  />
                  <label
                    htmlFor="personalConsultation"
                    className="text-sm text-gray-700"
                  >
                    I prefer an in-store consultation
                  </label>
                </div>

                <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                  <p className="text-yellow-800 text-sm">
                    Note: Delivery timelines and final pricing will be confirmed
                    during your consultation. No advance payment is required at
                    this stage.
                  </p>
                </div>
              </div>

              <div className="flex items-center mb-8">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={(e) =>
                    handleChange("termsAccepted", e.target.checked)
                  }
                  className="mr-2 h-5 w-5 text-[#EC4999] focus:ring-[#EC4999] border-gray-300 rounded"
                  required
                />
                <label
                  htmlFor="termsAccepted"
                  className="text-sm text-gray-700"
                >
                  I agree to the terms and conditions
                </label>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    !formData.termsAccepted ||
                    !formData.appointmentDate
                  }
                  className="bg-[#EC4999] text-white px-6 py-2 rounded hover:bg-[#d14284] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Booking..." : "Confirm Appointment"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative transition-all duration-300 scale-100 opacity-100"
            style={{
              animation: "fadeIn 0.4s ease-out forwards",
            }}
          >
            <div
              className="text-green-500 text-5xl mb-4"
              style={{ animation: "bounce 1s infinite" }}
            >
              ✅
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Thank You for Your Interest!
            </h2>
            <p className="text-gray-600 mb-6">
              We've received your custom design request. Our team will contact
              you soon!
            </p>
            <button
              onClick={() => {
                setShowConfirmation(false);
                router.push("/");
              }}
              className="mt-2 px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
            >
              Close
            </button>

            <style jsx>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
              @keyframes bounce {
                0%,
                100% {
                  transform: translateY(0);
                }
                50% {
                  transform: translateY(-8px);
                }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
}
