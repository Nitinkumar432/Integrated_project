import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../Models/admin.js";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";

// Load .env file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is undefined!");
  process.exit(1);
}

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("🔍 Checking for existing admin...");

    // Delete existing admin
    await Admin.deleteMany({});
    console.log("🗑️ Deleted existing admin.");

    // Create a new admin
    // const hashedPassword = await bcrypt.hash("admin@123", 10);
    await Admin.create({
      username: "admin",
      email: "admin@remend.com",
      password:"admin@123",
    });

    console.log("✅ New admin created successfully!");
  } catch (error) {
    console.error("❌ Error in seeding admin:", error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();
