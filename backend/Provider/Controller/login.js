import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ProviderData from  '../../Models/provideschema.js';
import Provider from "../Routes/provider.js";
import dotenv from "dotenv";

dotenv.config();

export const loginProvider = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;

    // Check if provider exists
    const provider = await ProviderData.findOne({ email });
    if (!provider) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, provider.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { providerId: provider._id, email: provider.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Store token in HTTP-only cookie as "providerToken"
    res.cookie("providerToken", token, {
      httpOnly: true, // Prevents access from JavaScript (secure)
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
    });

    console.log(req.body);
    // Send token in response
    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error logging in" });
  }
};
