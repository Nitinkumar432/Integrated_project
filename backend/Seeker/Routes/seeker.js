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
router.post("/rate/:id", async (req, res) => {
  try {
    const { rating } = req.body;
    const problem = await RepairProblem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ error: "Problem not found." });
    }

    // Add the new rating to the ratings array
    problem.ratings.push(rating);

    // Calculate new average rating
    const totalRatings = problem.ratings.length;
    const averageRating = (
      problem.ratings.reduce((sum, r) => sum + r, 0) / totalRatings
    ).toFixed(1);

    problem.averageRating = parseFloat(averageRating);
    await problem.save();

    res.json({
      message: "Rating updated successfully!",
      averageRating: problem.averageRating,
      totalRatings: totalRatings,
    });
  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Fetch problems from MongoDB and render the EJS page
router.get("/problempage", async (req, res) => {
  try {
    const problems = await RepairProblem.find(); // Fetch all repair problems
    console.log("Fetched Problems:", problems);
    res.render("Seeker/commonproblem.ejs", { problems }); // Pass problems to EJS
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
