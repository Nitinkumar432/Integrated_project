import mongoose from "mongoose";
import dotenv from "dotenv";
import RepairProblem from "../Models/repairProblem.js"; // Ensure this path is correct

dotenv.config(); // Load environment variables **before using them**

// ✅ Ensure `MONGO_URI` is properly loaded
console.log("MONGO_URI:", process.env.MONGO_URI);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
    seedDB();
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed!", err);
  });

// Sample repair problems
const problems = [
  {
    title: "How to Repair a Ceiling Fan",
    category: "Electronics",
    difficulty: "Medium",
    description: "Learn how to diagnose and fix common ceiling fan issues.",
    imageUrl: "/images/fan-repair.jpg",
    rating: 4,
    reviewCount: 128,
    solutionUrl: "/problem/ceiling-fan-repair",
  },
  {
    title: "How to Replace a Laptop Battery",
    category: "Computers",
    difficulty: "Easy",
    description:
      "Step-by-step guide to safely remove and replace your laptop battery.",
    imageUrl: "/images/laptop-battery.jpg",
    rating: 5,
    reviewCount: 215,
    solutionUrl: "/problem/laptop-battery-replacement",
  },
];

const seedDB = async () => {
  try {
    await RepairProblem.deleteMany(); // Clears existing data before inserting new ones
    await RepairProblem.insertMany(problems);
    console.log("✅ Problems inserted successfully!");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    mongoose.connection.close();
  }
};
