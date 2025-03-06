import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, default: "admin" },
  email: {
    type: String,
    required: true,
    unique: true,
    default: "admin@remend.com",
  },
  password: { type: String, required: true },
});

export default mongoose.model("Admin", adminSchema);
