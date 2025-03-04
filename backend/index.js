import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import chalk from "chalk";
import figlet from "figlet";
import boxen from "boxen";
import seeker from './Seeker/Routes/seeker.js';
import provider from './Provider/Routes/provider.js'; // ✅ Import provider routes
import cookieParser from "cookie-parser";

// Load environment variables
dotenv.config();

const app = express();

console.log("🛠 Views directory set to:", path.join(process.cwd(), "../frontend/views"));

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // Update with frontend URL if different
  methods: ["GET", "POST"],
  credentials: true // Allow cookies/auth headers
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Set EJS as the view engine and point to frontend folder
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "../frontend/views"));

// Serve static files from frontend
app.use(express.static(path.join(process.cwd(), "../frontend/public")));

// Display a fancy title
console.log(chalk.cyan(figlet.textSync("ReMend Server", { horizontalLayout: "full" })));

console.log(
  boxen(chalk.green.bold("🚀 Starting Express Server..."), {
    padding: 1,
    margin: 1,
    borderStyle: "double",
    borderColor: "cyan",
  })
);

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Failed!");
    console.error(err);
  });

// Sample Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Home Page" });
});
app.get("/register", (req, res) => {
  res.render("./Common/Register.ejs");
});
app.get("/login", (req, res) => {
  res.render("./Common/Login.ejs");
});

// Seeker Routes
app.use("/seeker", seeker);

// ✅ Provider Routes
app.use("/provider", provider);

// Start Server
const PORT = process.env.PORT || 5000;

setTimeout(() => {
  console.log(chalk.blue.bold("📡 Initializing Server..."));
  setTimeout(() => {
    console.log(chalk.yellow("⚡ Express Server is Booting Up..."));
    setTimeout(() => {
      app.listen(PORT, () => {
        console.log(chalk.green.bold(`✅ Server is running at: http://localhost:${PORT}`));
      });
    }, 1500);
  }, 1500);
}, 1000);
