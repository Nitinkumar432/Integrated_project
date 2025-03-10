import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

export const authenticateUser = (req, res, next) => {
  const token = req.cookies.seekerToken; // Get token from cookies
  console.log(token);

  if (!token) {
    return res.redirect("/login"); // Redirect to login if no token
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded; // Attach user data to request
    next(); // Proceed if authentication is successful
  } catch (error) {
    res.clearCookie("seekerToken"); // Clear invalid token
    return res.redirect("/login"); // Redirect to login on invalid token
  }
};
