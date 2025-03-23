import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., "approval", "registration", "deletion"
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Activity = mongoose.model("Activity", ActivitySchema);
export default Activity;
