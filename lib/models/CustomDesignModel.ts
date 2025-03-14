import mongoose from 'mongoose';

const customDesignSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Step 1 fields
  gender: { type: String, enum: ['male', 'female'], required: true },
  contactNumber: {
    type: String,
    required: true,
  },
  designType: { 
    type: String, 
    enum: ['Rings', 'Bracelets', 'Bangles', 'Necklaces', 'Earings'], 
    required: true 
  },
  metalType: { type: String, enum: ['gold', 'silver'], required: true },
  materialKarat: { type: Number, enum: [20, 24], required: true },
  budget: { type: Number, min: 20000, required: true },

  // Step 2 fields
  designMethod: { type: String, enum: ['details', 'image'], required: true },
  stoneType: { type: String, enum: ['diamond', 'gemstone', 'no stone'] },
  customImage: {
    type: String,
    required: false,
  },
  occasion: { type: String, enum: ['wedding', 'engagement'], required: true },
  size: { type: Number, min: 7, max: 20, required: true },
  additionalDetails: { type: String },

  // Step 3 fields
  timeline: { type: String, required: true },
  termsAccepted: { type: Boolean, required: true },
  customizationAccepted: { type: Boolean, required: true },
  
  // Order details
  subtotal: { type: Number, required: true },
  gst: { type: Number, required: true },
  couponApplied: { type: String },
  couponDiscount: { type: Number, default: 0 },
  deliveryCharge: { type: Number, default: 0 },
  totalPayable: { type: Number, required: true },
  
  description: String,
  imageUrls: [String], // Array of image URLs
  specifications: {
    gender: String,
    size: String,
    occasion: String,
    stoneType: String,
    materialKarat: String,
    designMethod: String
  },
  contactPreference: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  adminNotes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const CustomDesignModel = mongoose.models.CustomDesign || mongoose.model('CustomDesign', customDesignSchema);
export default CustomDesignModel; 