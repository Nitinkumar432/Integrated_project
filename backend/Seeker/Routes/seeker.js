import express from "express";
import { registerSeeker } from "../Controller/register.js";
import RepairProblem from "../../Models/repairProblem.js"; // Import the model
import { loginSeeker } from "../Controller/login.js";
import { authenticateUser } from "../../middlewares/auth.js";

const router = express.Router();

// Test route
router.get("/", (req, res) => {
  res.send("hello ji");
});

// ⭐ API to Submit Rating
// Route to submit a rating
router.post("/rate/:problemId", authenticateUser, async (req, res) => {
  try {
    const { problemId } = req.params;
    const { rating } = req.body;
    const userId = req.user.userId; // Get user ID from token

    const problem = await RepairProblem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    // Check if user has already rated
    const existingRating = problem.ratings.find(
      (r) => r.userId.toString() === userId
    );
    if (existingRating) {
      return res
        .status(400)
        .json({ error: "You have already rated this problem." });
    }

    // Add new rating
    problem.ratings.push({ userId, rating: parseInt(rating) });
    await problem.save();

    res.json({
      message: "Rating submitted successfully!",
      averageRating: problem.averageRating,
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
    });
  } catch (err) {
    console.error("Error fetching problems:", err);
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

export default router;
