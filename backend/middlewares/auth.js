import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


dotenv.config();

export const authenticateUser = (req, res, next) => {
  const token = req.cookies.seekerToken; // Get token from request header
  console.log(token);

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded; // Attach user data to request
    next(); // Move to the next middleware
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};
