import mongoose from "mongoose";

// Repair Problem Schema
const RepairProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true }, // Image URL for the problem
  ratings: [{ userId: mongoose.Schema.Types.ObjectId, rating: Number }], // Track user ratings
  reviewCount: { type: Number, default: 0 }, // Number of reviews
  solutionUrl: { type: String, required: true }, // Link to full solution
  createdAt: { type: Date, default: Date.now },
});

// Compute average rating dynamically
// Virtual field for average rating
RepairProblemSchema.virtual("averageRating").get(function () {
  if (this.ratings.length === 0) return 0;
  const totalStars = this.ratings.reduce((sum, r) => sum + r.rating, 0);
  return (totalStars / this.ratings.length).toFixed(1);
});

export default mongoose.model("RepairProblem", RepairProblemSchema);
