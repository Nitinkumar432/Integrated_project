import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import RepairProblem from "../Models/repairProblem.js"; // Ensure this path is correct
import { fileURLToPath } from "url";

// Load .env file manually
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("🔍 MONGO_URI from .env:", process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is undefined! Check your .env file.");
  process.exit(1);
}

const MONGO_URI = process.env.MONGO_URI;

console.log("MONGO_URI:", MONGO_URI); // Debugging log

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ MongoDB Connected Successfully!");
    await seedDB(); // ✅ Call the function after successful connection
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Failed!");
    console.error(err);
  });

// Sample repair problems (Default `reviewCount: 0`)
const problems = [
  {
    title: "How to Repair a Ceiling Fan",
    category: "Electronics",
    difficulty: "Medium",
    description: "Learn how to diagnose and fix common ceiling fan issues.",
    imageUrl: "/images/fan-repair.jpg",
    rating: 4,
    reviewCount: 0, // ✅ Default review count set to 0
    solutionUrl: "https://www.youtube.com/watch?v=sMHzfigUxz4",
  },
  {
    title: "How to Replace a Laptop Battery",
    category: "Computers",
    difficulty: "Easy",
    description:
      "Step-by-step guide to safely remove and replace your laptop battery.",
    imageUrl: "/images/laptop-battery.jpg",
    rating: 5,
    reviewCount: 0, // ✅ Default review count set to 0
    solutionUrl: "https://www.youtube.com/watch?v=sMHzfigUxz4",
  },
];

const seedDB = async () => {
  try {
    console.log("🗑️ Deleting old problems...");
    const deleteResult = await RepairProblem.deleteMany();
    console.log(`🛑 Deleted ${deleteResult.deletedCount} existing problems.`);

    console.log("📌 Inserting new problems...");
    const insertedData = await RepairProblem.insertMany(problems);
    console.log(`✅ Successfully inserted ${insertedData.length} problems!`);
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    console.log("🔌 Closing MongoDB connection...");
    mongoose.connection.close();
  }
};
