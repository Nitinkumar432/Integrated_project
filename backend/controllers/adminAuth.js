import Admin from "../Models/admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// Admin Login
export const loginAdmin = async (req, res) => {
  console.log(req.body);
  try {
    const { username, password } = req.body;

    // Find Admin (Default admin only)
    const admin = await Admin.findOne({ username: "admin" });
    if (!admin) {
      return res.status(400).json({ error: "Admin not found" });
    }

    // Verify Password
    // const isMatch = await bcrypt.compare(password, admin.password);
    // if (!isMatch) {
    //   return res.status(400).json({ error: "Invalid username or password" });
    // }

    if (password !== admin.password) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { adminId: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // res.status(200).json({ message: "Admin login successful!", token });
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ error: "Error logging in" });
  }
};
