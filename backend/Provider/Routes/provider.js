import express from "express";
import { registerProvider } from "../Controller/register.js";
import { loginProvider } from "../Controller/login.js";
import { authenticateUser } from "../../middlewares/auth.js";
import Provider from "../../Models/provideschema.js"; // Updated import path

const router = express.Router();

// Test route
router.get("/", (req, res) => {
  res.send("Welcome to the Provider Route");
});

// Fetch providers from MongoDB and render the EJS page
router.get("/providerpage", async (req, res) => {
  try {
    const providers = await Provider.find(); // Fetch all providers
    console.log("Fetched Providers:", providers);
    res.render("Provider/providerList.ejs", { providers }); // Pass providers to EJS
  } catch (err) {
    console.error("Error fetching providers:", err);
    res.status(500).send("Server Error");
  }
});

// Register provider route
router.post("/register", registerProvider);

// Login route
router.post("/login", loginProvider);

// Protected provider profile route
router.get("/profile", authenticateUser, (req, res) => {
  res.send(req.user);
});

export default router;
