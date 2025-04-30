import express from "express";
import { registerProvider } from "../Controller/register.js";
import { loginProvider } from "../Controller/login.js";
import { authenticateProvider } from "../../middlewares/authenticateProvider.js";
import Provider from "../../Models/provideschema.js";
import JobRequest from "../../Models/jobRequests.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Request from '../../Models/problemrequest.js'

const router = express.Router();

console.log("✅ Provider Routes Loaded");

// ✅ Provider Dashboard Route
router.get("/dashboard", authenticateProvider, async (req, res) => {
  try {
    const provider = await Provider.findById(req.user.providerId);
    // const allRequests = await Request.find({ providerId: provider._id });
    if (!provider) return res.status(404).json({ error: "Provider not found" });

    const jobRequests = await Request.find({ providerId: provider._id });

    // Ensure completedJobs has a value (count jobs with status "Completed")
    const completedJobs = jobRequests.filter(
      (job) => job.status === "completed"
    ).length;

    res.render("Provider/providerDashboard", {
      provider,
      jobRequests,
      completedJobs, // ✅ Ensure this is passed to the EJS file
    });
  } catch (error) {
    console.error("❌ Error fetching provider dashboard:", error);
    res.status(500).json({ error: "Server error" });
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
// ✅ Login Provider & Redirect to Dashboard if Verified
router.post("/login", async (req, res) => {
  const { email, password, lat, lon } = req.body; // Make sure lat/lon is sent

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

    // 🔄 Update locationCoordinates if still default
    const existingCoords = provider.locationCoordinates?.coordinates || [0, 0];
    const isDefault = existingCoords[0] === 0 && existingCoords[1] === 0;

    if (isDefault && lat && lon) {
      provider.locationCoordinates = {
        type: "Point",
        coordinates: [lon, lat], // longitude first
      };
      provider.lastUpdatedLocationAt = new Date();
      await provider.save();
      console.log(
        "📍 Location Coordinates Updated:",
        provider.locationCoordinates
      );
    } else {
      console.log("📍 Location already set or missing lat/lon.");
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

router.post("/update-location", async (req, res) => {
  try {
    const token = req.cookies.providerToken;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const providerId = decoded.providerId;

    const { lat, lon } = req.body;
    if (!lat || !lon) {
      return res.status(400).json({ error: "Missing coordinates" });
    }

    const provider = await Provider.findById(providerId);
    if (!provider) return res.status(404).json({ error: "Provider not found" });

    const existingCoords = provider.locationCoordinates?.coordinates || [0, 0];
    const isDefault = existingCoords[0] === 0 && existingCoords[1] === 0;

    if (isDefault) {
      provider.locationCoordinates = {
        type: "Point",
        coordinates: [lon, lat], // [longitude, latitude]
      };
      provider.lastUpdatedLocationAt = new Date();

      await provider.save();
      console.log(
        "📍 Provider location updated:",
        provider.locationCoordinates
      );
      return res.status(200).json({ message: "Location updated" });
    }

    console.log("📍 Location already set");
    res.status(200).json({ message: "Location already set" });
  } catch (err) {
    console.error("Error updating location:", err);
    res.status(500).json({ error: "Failed to update location" });
  }
});

// ✅ Logout Route
router.get("/logout", (req, res) => {
  res.clearCookie("providerToken");
  res.redirect("/login");
});

export default router;
