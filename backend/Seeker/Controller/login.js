import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Seeker from "../../Models/seekers.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

export const loginSeeker = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await Seeker.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Store token in HTTP-only cookie as "seekerToken"
    res.cookie("seekerToken", token, {
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
