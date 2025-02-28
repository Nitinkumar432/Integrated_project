import mongoose from "mongoose";

// Repair Problem Schema
const RepairProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true }, // Image URL for the problem
  rating: { type: Number, min: 1, max: 5, required: true }, // Star rating (1-5)
  reviewCount: { type: Number, default: 0 }, // Number of reviews
  solutionUrl: { type: String, required: true }, // Link to full solution
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("RepairProblem", RepairProblemSchema);
