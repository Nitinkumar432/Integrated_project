import mongoose from "mongoose";

const JobRequestSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",
    required: true,
  },
  seekerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seeker",
    required: true,
  },
  jobDetails: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "completed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const JobRequest = mongoose.model("JobRequest", JobRequestSchema);
export default JobRequest;
