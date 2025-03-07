import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set views directory correctly
app.set("views", path.join(__dirname, "../frontend/views"));
app.set("view engine", "ejs");

// ✅ Clear Admin Token on Server Restart
// app.use((req, res, next) => {
//   res.clearCookie("adminToken"); // Ensure token is cleared
//   next();
// });

// ✅ Use admin routes
app.use("/admin", adminRoutes);

// ✅ List all registered routes
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(middleware.route.path);
  } else if (middleware.name === "router") {
    middleware.handle.stack.forEach((subMiddleware) => {
      if (subMiddleware.route) {
        console.log(subMiddleware.route.path);
      }
    });
  }
});

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Admin MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.ADMIN_PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Admin Server running at: http://localhost:${PORT}`);
});
