import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import RepairProblem from "../Models/repairProblem.js";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("🔍 MONGO_URI from .env:", process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is undefined! Check your .env file.");
  process.exit(1);
}

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ MongoDB Connected Successfully!");
    await resetRatings();
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Failed!");
    console.error(err);
  });

const resetRatings = async () => {
  try {
    console.log("🔄 Resetting problem ratings...");

    const updateResult = await RepairProblem.updateMany(
      {},
      { $set: { ratings: [], reviewCount: 0 } } // Clear ratings & review count
    );

    console.log(`✅ Reset ratings for ${updateResult.modifiedCount} problems.`);
  } catch (err) {
    console.error("❌ Error resetting ratings:", err);
  } finally {
    console.log("🔌 Closing MongoDB connection...");
    mongoose.connection.close();
  }
};
