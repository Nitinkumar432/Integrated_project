import express from "express";
import Problem from "../Models/problemModel.js"; // adjust path if needed

const router = express.Router();

router.get("/problems", async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
