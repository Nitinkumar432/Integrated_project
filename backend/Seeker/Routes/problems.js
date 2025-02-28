import express from "express";
import RepairProblem from "../../Models/repairProblem.js";

const router = express.Router();

// Test Route
router.get("/", (req, res) => {
  res.send("Hello, Seeker!");
});

// Render the Problems Page
router.get("/problempage", async (req, res) => {
  try {
    const problems = await RepairProblem.find(); // Fetch all problems from DB
    res.render("./Seeker/commonproblem.ejs", { problems }); // Pass data to EJS
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

export default router;
