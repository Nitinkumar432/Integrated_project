import express from "express";
import path from "path";
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
import Admin from "../Models/admin.js";

import multer from "multer";

const router = express.Router();

// Serve uploaded images statically
router.use("/uploads", express.static(path.resolve("backend/uploads")));
// router.use("/uploads", express.static(path.join("backend/uploads")));

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

// ✅ Serve Admin Profile Page
router.get("/profile", authenticateAdmin, async (req, res) => {
  try {
    const admin = await Admin.findOne({ username: "admin" });
    if (!admin) return res.status(404).send("Admin not found");

    res.render("Admin/adminProfile.ejs", { admin });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).send("Server Error");
  }
});

// ✅ Handle Admin Profile Update
router.post("/profile/update", authenticateAdmin, async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const updateFields = {};

    if (email) updateFields.email = email;
    if (newPassword) updateFields.password = newPassword;

    await Admin.findOneAndUpdate({ username: "admin" }, updateFields, {
      new: true,
    });

    res.redirect("/admin/profile");
  } catch (error) {
    console.error("Error updating admin profile:", error);
    res.status(500).send("Server Error");
  }
});

// ✅ Serve Admin Settings Page
router.get("/settings", authenticateAdmin, (req, res) => {
  res.render("Admin/adminSettings.ejs"); // Ensure this file exists in views/Admin
});

// ✅ Multer Storage for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ✅ GET Route: Render Manage Common Problems Page
router.get("/common-problems", async (req, res) => {
  try {
    const problems = await RepairProblem.find(); // Fetch existing problems
    res.render("admin/manageCommonProblems.ejs", { problems }); // Render EJS
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).send("Server Error");
  }
});

// ✅ POST Route: Handle New Problem Submission
router.post(
  "/common-problems/add",
  upload.single("imageFile"), // Handle image upload
  async (req, res) => {
    try {
      const { title, category, difficulty, description, solutionUrl } =
        req.body;
      const imageUrl = req.file
        ? `/uploads/${req.file.filename}`
        : req.body.imageUrl; // Use uploaded image or URL

      // Create new problem
      const newProblem = new RepairProblem({
        title,
        category,
        difficulty,
        description,
        imageUrl,
        solutionUrl,
      });

      await newProblem.save();
      res.redirect("/admin/common-problems"); // Redirect to manage page
    } catch (error) {
      console.error("Error adding problem:", error);
      res.status(500).send("Server Error");
    }
  }
);

// ✅ POST Route: Delete a Problem
router.post("/common-problems/delete/:id", async (req, res) => {
  try {
    await RepairProblem.findByIdAndDelete(req.params.id);
    res.redirect("/admin/common-problems"); // Refresh page after deletion
  } catch (error) {
    console.error("Error deleting problem:", error);
    res.status(500).send("Server Error");
  }
});

// ✅ Route to render the "Manage Common Problems" page
router.get("/common-problems", async (req, res) => {
  try {
    const problems = await RepairProblem.find(); // Fetch all common problems
    res.render("admin/manageCommonProblems.ejs", { problems }); // Render EJS page
  } catch (error) {
    console.error("Error fetching common problems:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/manage-common-problems", async (req, res) => {
  try {
    const problems = await RepairProblem.find();
    res.render("admin/manageCommonProblem", { problems });
  } catch (error) {
    console.error("Error fetching common problems:", error);
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
