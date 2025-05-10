import mongoose from "mongoose";

const ProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  problem: { type: String, required: true },
  subproblem: { type: String, required: true },
  experience: { type: Number, required: true },
  certifications: [{ type: String }],
  gstNumber: { type: String, required: true },
  governmentProof: { type: String, required: true },
  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
  serviceLocation: { type: String, required: true },
  availability: { type: String, required: true },
  pricingDetails: { type: String },
  ratings: { type: Number, min: 0, max: 5, default: 0 },
  reviews: [{ userId: String, comment: String, rating: Number }],

  // 💡 Add this for dynamic geolocation
  locationCoordinates: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
      required: true,
    },
  },
  lastUpdatedLocationAt: {
    type: Date,
  },

  createdAt: { type: Date, default: Date.now },
});

ProviderSchema.index({ locationCoordinates: "2dsphere" });

const Provider = mongoose.model("Provider", ProviderSchema);
export default Provider;
