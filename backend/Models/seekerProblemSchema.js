import mongoose from "mongoose";

const SeekerProblemSchema = new mongoose.Schema({
  seekerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seeker",
    required: true,
  },
  problemType: { type: String, required: true },
  subProblem: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },

  // 👇 Added this for geospatial queries
  locationCoordinates: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },

  createdAt: { type: Date, default: Date.now },
  tags: [{ type: String }],
});

// 👇 Create a 2dsphere index for geolocation queries
SeekerProblemSchema.index({ locationCoordinates: "2dsphere" });

export default mongoose.model("SeekerProblem", SeekerProblemSchema);
