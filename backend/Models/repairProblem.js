import mongoose from "mongoose";

// Repair Problem Schema
const RepairProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true }, // Image URL for the problem
  ratings: { type: [Number], default: [] },
  reviewCount: { type: Number, default: 0 }, // Number of reviews
  solutionUrl: { type: String, required: true }, // Link to full solution
  createdAt: { type: Date, default: Date.now },
});

// Compute average rating dynamically
RepairProblemSchema.virtual("averageRating").get(function () {
  if (this.ratings.length === 0) return 0; // Default rating if no reviews
  const totalStars = this.ratings.reduce((sum, rating) => sum + rating, 0);
  return (totalStars / this.ratings.length).toFixed(1); // Round to 1 decimal place
});

export default mongoose.model("RepairProblem", RepairProblemSchema);
