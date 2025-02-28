import express from "express";
import { registerSeeker } from "../Controller/register.js";
import RepairProblem from "../../Models/repairProblem.js"; // Import the model

const router = express.Router();

// Test route
router.get("/", (req, res) => {
  res.send("hello ji");
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

export default router;
