import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Provider from "../Models/provideschema.js"; // Import Provider model
dotenv.config();

export const authenticateProvider = (req, res, next) => {
  const token = req.cookies.providerToken; // ✅ Ensure this matches the cookie name

  if (!token) {
    return res.redirect("/login"); // ✅ Redirect if no token
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Verify JWT
    req.user = decoded; // ✅ Attach provider details to `req.user`
    next();
  } catch (error) {
    console.error("❌ Invalid provider token:", error);
    res.clearCookie("providerToken"); // ✅ Clear invalid token
    return res.redirect("/login"); // ✅ Redirect to login
  }
};
