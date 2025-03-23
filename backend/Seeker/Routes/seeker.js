import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { registerSeeker } from "../Controller/register.js";
import RepairProblem from "../../Models/repairProblem.js";
import { loginSeeker } from "../Controller/login.js";
import { authenticateUser } from "../../middlewares/auth.js";
import Seeker from "../../Models/seekers.js";
import multer from "multer";
// import path from "path";
import bcrypt from "bcryptjs";
import fs from "fs";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env from backend folder
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("Gemini API Key:", process.env.GEMINI_API_KEY);

const router = express.Router();

// ✅ Ensure the Upload Directory Exists
const profilePicsPath = path.resolve("uploads/profile_pics");
if (!fs.existsSync(profilePicsPath)) {
  fs.mkdirSync(profilePicsPath, { recursive: true });
}

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profilePicsPath); // Save inside uploads/profile_pics
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// ✅ Serve Static Files for Profile Images
router.use("/uploads", express.static(path.resolve("uploads")));

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// // ✅ Route to Render Ask Question Page
// router.get("/ask-question", (req, res) => {
//   res.render("Seeker/askQuestion.ejs"); // Ensure this file exists in views/Seeker/
// });

// // ✅ AI Chatbot Route
// router.post("/ask-question", async (req, res) => {
//   try {
//     const { question } = req.body;

//     if (!question) {
//       return res.status(400).json({ error: "Question is required" });
//     }

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo", // ✅ Use GPT-3.5-Turbo (since GPT-4 is not available)
//       messages: [{ role: "user", content: question }],

//     });

//     if (!response.choices || response.choices.length === 0) {
//       throw new Error("Invalid AI response");
//     }

//     res.json({ reply: response.choices[0].message.content });
//   } catch (error) {
//     console.error("AI Chatbot Error:", error.message || error);
//     res.status(500).json({ error: "Failed to process request" });
//   }
// });

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// ✅ Route to Render Ask Question Page
router.get("/ask-question", (req, res) => {
  res.render("Seeker/askQuestion.ejs");
});

// ✅ AI Chatbot Route
router.post("/ask-question", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question)
      return res.status(400).json({ error: "Question is required" });

    // Generate Response from Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(question);
    const response = await result.response;
    const reply = response.text();

    res.json({ reply });
  } catch (error) {
    console.error("AI Chatbot Error:", error);
    res.status(500).json({ error: "Failed to generate solution" });
  }
});

// ✅ Redirect Root Route to Login
router.get("/", (req, res) => {
  res.redirect("/login");
});

// ✅ GET: Render Seeker Profile
router.get("/profile", authenticateUser, async (req, res) => {
  try {
    const seeker = await Seeker.findById(req.user.userId);
    if (!seeker) {
      return res.status(404).send("Seeker not found");
    }

    const repairRequests = await RepairProblem.find({ userId: seeker._id });

    res.render("Seeker/profile.ejs", {
      seeker,
      repairRequests,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).send("Server Error");
  }
});

// ✅ POST: Update Profile
router.post(
  "/edit-profile",
  authenticateUser,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const { name, email, location, password } = req.body;
      const seeker = await Seeker.findById(req.user.userId);

      if (!seeker) return res.status(404).send("Seeker not found");

      // ✅ Update only provided fields
      if (name) seeker.name = name;
      if (email) seeker.email = email;
      if (location) seeker.location = location;
      if (password) seeker.password = await bcrypt.hash(password, 10); // Hash new password

      // ✅ Update profile image only if a new file is uploaded
      if (req.file) {
        seeker.profileImage = `/uploads/profile_pics/${req.file.filename}`;
      }

      await seeker.save();
      res.redirect("/seeker/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).send("Server Error");
    }
  }
);

// ⭐ API to Submit Rating
// Route to submit a rating
// Route to submit or update a rating
router.post("/rate/:problemId", authenticateUser, async (req, res) => {
  try {
    const { problemId } = req.params;
    const { rating } = req.body;
    const userId = req.user.userId;

    const problem = await RepairProblem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    const parsedRating = parseInt(rating);
    if (parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ error: "Invalid rating. Must be 1-5." });
    }

    // Check if the user has already rated
    const existingRating = problem.ratings.find(
      (r) => r.userId.toString() === userId
    );

    if (existingRating) {
      existingRating.rating = parsedRating; // Update existing rating
    } else {
      problem.ratings.push({ userId, rating: parsedRating });
    }

    await problem.save();

    // Recalculate average rating
    const totalStars = problem.ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = (totalStars / problem.ratings.length).toFixed(1);

    res.json({
      message: "Rating updated successfully!",
      averageRating,
      totalRatings: problem.ratings.length,
    });
  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch problems from MongoDB and render the EJS page
// 🔹 Fetch problems and pass `currentUserId` to EJS
router.get("/problempage", authenticateUser, async (req, res) => {
  try {
    const problems = await RepairProblem.find();
    console.log("Fetched Problems:", problems);
    res.render("Seeker/commonproblem.ejs", {
      problems,
      currentUserId: req.user.userId, // ✅ Pass logged-in user ID
      activeCategory: "all",
    });
  } catch (err) {
    console.error("Error fetching problems:", err);
    res.status(500).send("Server Error");
  }
});

// ✅ Seeker Dashboard Route
router.get("/dashboard", authenticateUser, async (req, res) => {
  try {
    // Fetch Seeker Details
    const seeker = await Seeker.findById(req.user.userId);
    if (!seeker) return res.status(404).send("Seeker not found");

    // Fetch Repair Requests Made by This Seeker
    const repairRequests = await RepairProblem.find({ userId: seeker._id });

    // ✅ Pass `repairRequests` to `dashboard.ejs`
    res.render("Seeker/dashboard.ejs", { seeker, repairRequests });
  } catch (error) {
    console.error("Error fetching seeker dashboard:", error);
    res.status(500).send("Server Error");
  }
});

// Register seeker route
router.post("/register", registerSeeker);

// Login route
router.post("/login", loginSeeker);

router.get("/profile", authenticateUser, (req, res) => {
  res.send(req.user);
});

// ✅ Seeker Logout Route
router.get("/logout", (req, res) => {
  res.clearCookie("seekerToken", { path: "/" }); // Ensure cookie is cleared globally
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private"); // Prevent caching
  res.redirect("/login"); // Redirect to login page
});

export default router;
