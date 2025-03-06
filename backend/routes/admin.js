import express from "express";
import { loginAdmin } from "../controllers/adminAuth.js";
import { authenticateAdmin } from "../middlewares/adminAuth.js";
import {
  getPendingProviders,
  approveProvider,
  rejectProvider,
  getAllSeekers,
} from "../controllers/adminActions.js";

const router = express.Router();

// ✅ Serve Admin Login Page
router.get("/login", (req, res) => {
  res.render("Admin/adminLogin.ejs"); // Ensure this file exists
});

// ✅ Handle Admin Login Request
router.post("/login", loginAdmin);

// ✅ Serve Admin Dashboard (Protected Route)
router.get("/dashboard", authenticateAdmin, (req, res) => {
  res.render("Admin/adminDashboard.ejs"); // Ensure this file exists
});

// ✅ Protected Admin Routes
router.get("/pending-providers", authenticateAdmin, getPendingProviders);
router.put("/approve-provider/:providerId", authenticateAdmin, approveProvider);
router.put("/reject-provider/:providerId", authenticateAdmin, rejectProvider);
router.get("/seekers", authenticateAdmin, getAllSeekers);

export default router;
