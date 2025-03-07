import express from "express";
import { loginAdmin } from "../controllers/adminAuth.js";
import { authenticateAdmin } from "../middlewares/adminAuth.js";
import {
  getPendingProviders,
  approveProvider,
  rejectProvider,
  getAllSeekers,
} from "../controllers/adminActions.js";

import Provider from "../Models/provideschema.js";
import Seeker from "../Models/seekers.js";
import RepairProblem from "../Models/repairProblem.js";

const router = express.Router();

// ✅ Serve Admin Login Page
router.get("/login", (req, res) => {
  res.render("Admin/adminLogin.ejs");
});

// ✅ Handle Admin Login Request
router.post("/login", loginAdmin);

// ✅ Admin Logout Route
router.get("/logout", (req, res) => {
  res.clearCookie("adminToken"); // Remove the token cookie
  res.redirect("/admin/login"); // Redirect to login page
});

// ✅ Serve Admin Dashboard (Protected Route)
// router.get("/dashboard", authenticateAdmin, (req, res) => {
//   res.render("Admin/adminDashboard.ejs"); // Ensure this file exists
// });

// ✅ Serve Admin Dashboard (Protected Route)
router.get("/dashboard", authenticateAdmin, async (req, res) => {
  try {
    const pendingProvidersCount = await Provider.countDocuments({
      verificationStatus: "pending",
    });
    const providersCount = await Provider.countDocuments({
      verificationStatus: "verified",
    });
    const seekersCount = await Seeker.countDocuments();
    const totalRequests = pendingProvidersCount + providersCount;

    res.render("Admin/adminDashboard.ejs", {
      pendingProvidersCount,
      providersCount,
      seekersCount,
      totalRequests,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    res.status(500).send("Server Error");
  }
});

// ✅ Protected Admin Routes
// router.get("/pending-providers", authenticateAdmin, getPendingProviders);
// router.put("/approve-provider/:providerId", authenticateAdmin, approveProvider);
// router.put("/reject-provider/:providerId", authenticateAdmin, rejectProvider);

// ✅ Serve Pending Providers Page
router.get("/pending-providers", authenticateAdmin, async (req, res) => {
  try {
    const pendingProviders = await Provider.find({
      verificationStatus: "pending",
    });
    res.render("Admin/pendingProviders.ejs", { pendingProviders });
  } catch (error) {
    console.error("Error fetching pending providers:", error);
    res.status(500).send("Server Error");
  }
});

// ✅ Approve Provider
router.put(
  "/approve-provider/:providerId",
  authenticateAdmin,
  async (req, res) => {
    try {
      const provider = await Provider.findByIdAndUpdate(req.params.providerId, {
        verificationStatus: "verified",
      });
      if (!provider)
        return res.status(404).json({ error: "Provider not found" });
      res.json({ message: "Provider approved successfully!" });
    } catch (error) {
      console.error("Error approving provider:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// ✅ Reject Provider
router.put(
  "/reject-provider/:providerId",
  authenticateAdmin,
  async (req, res) => {
    try {
      const provider = await Provider.findByIdAndDelete(req.params.providerId);
      if (!provider)
        return res.status(404).json({ error: "Provider not found" });
      res.json({ message: "Provider rejected and removed!" });
    } catch (error) {
      console.error("Error rejecting provider:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// ✅ Serve Verified Providers Page
router.get("/verified-providers", authenticateAdmin, async (req, res) => {
  try {
    const verifiedProviders = await Provider.find({
      verificationStatus: "verified",
    });
    res.render("Admin/verifiedProviders.ejs", { verifiedProviders });
  } catch (error) {
    console.error("Error fetching verified providers:", error);
    res.status(500).send("Server Error");
  }
});

// router.get("/seekers", authenticateAdmin, getAllSeekers);

// ✅ Serve Seekers Management Page
router.get("/seekers", authenticateAdmin, async (req, res) => {
  try {
    const seekers = await Seeker.find();
    res.render("Admin/adminSeekers.ejs", { seekers });
  } catch (error) {
    console.error("Error fetching seekers:", error);
    res.status(500).send("Server Error");
  }
});

// ✅ Fetch Seeker Details & Requests
router.get("/seekers/:id", authenticateAdmin, async (req, res) => {
  try {
    const seeker = await Seeker.findById(req.params.id);
    if (!seeker) return res.status(404).send("Seeker not found");

    // Fetch repair requests made by this seeker
    const repairRequests = await RepairProblem.find({ userId: seeker._id });

    res.render("Admin/seekerDetails.ejs", { seeker, repairRequests });
  } catch (error) {
    console.error("Error fetching seeker details:", error);
    res.status(500).send("Server Error");
  }
});

// ✅ Delete Seeker
router.delete("/seekers/:id", authenticateAdmin, async (req, res) => {
  try {
    await Seeker.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Seeker deleted successfully" });
  } catch (error) {
    console.error("Error deleting seeker:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Send Message to Seeker (Placeholder)
router.post("/seekers/:id/message", authenticateAdmin, (req, res) => {
  try {
    // For now, we simulate sending a message
    res.status(200).json({ message: "Message sent to seeker successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;
