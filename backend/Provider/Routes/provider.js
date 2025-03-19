import express from "express";
import { registerProvider } from "../Controller/register.js";
import { loginProvider } from "../Controller/login.js";
import { authenticateProvider } from "../../middlewares/authenticateProvider.js";
import Provider from "../../Models/provideschema.js";
import JobRequest from "../../Models/jobRequests.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

console.log("✅ Provider Routes Loaded");

// ✅ Provider Dashboard Route
router.get("/dashboard", authenticateProvider, async (req, res) => {
  try {
    console.log("🔹 Authenticated Provider ID:", req.user.providerId); // ✅ Debug log

    const provider = await Provider.findById(req.user.providerId);
    if (!provider) {
      console.log("❌ Provider not found in the database");
      return res.status(404).send("Provider not found");
    }

    const jobRequests = await JobRequest.find({ providerId: provider._id });

    res.render("Provider/providerDashboard.ejs", { provider, jobRequests });
  } catch (error) {
    console.error("❌ Error fetching provider dashboard:", error);
    res.status(500).send("Server Error");
  }
});

// ✅ Provider List Page (Public)
router.get("/providerpage", async (req, res) => {
  try {
    const providers = await Provider.find();
    res.render("Provider/providerList.ejs", { providers });
  } catch (err) {
    console.error("Error fetching providers:", err);
    res.status(500).send("Server Error");
  }
});

// ✅ Register Provider Route
router.post("/register", registerProvider);

// ✅ Login Provider & Redirect to Dashboard if Verified
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("🔹 Provider Login Attempt:", email);

    const provider = await Provider.findOne({ email });
    if (!provider) {
      console.log("❌ Provider Not Found");
      return res.status(400).json({ error: "Invalid email or password" });
    }

    if (provider.verificationStatus !== "verified") {
      console.log("❌ Provider Not Verified");
      return res
        .status(403)
        .json({ error: "Your account is not verified yet." });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, provider.password);
    if (!isMatch) {
      console.log("❌ Incorrect Password");
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign(
      { providerId: provider._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("providerToken", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("✅ Login Successful, Redirecting to Dashboard...");
    res.redirect("/provider/dashboard");
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ error: "Error logging in", details: error.message });
  }
});

// ✅ Logout Route
router.get("/logout", (req, res) => {
  res.clearCookie("providerToken");
  res.redirect("/login");
});

export default router;
