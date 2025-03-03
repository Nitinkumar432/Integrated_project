import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"; // For JWT authentication
import Seeker from "../../Models/seekers.js";  

export const registerSeeker = async (req, res) => {
  try {
    const { 
      name, email, phone, password, address, state, city, 
      zipCode, age, gender, occupation 
    } = req.body;

    // Ensure required fields are provided
    if (!name || !email || !phone || !password || !address || !state || !city || !zipCode || !age || !gender) {
      return res.status(400).json({ error: "All required fields must be filled!" });
    }

    // Check if email or phone already exists
    const existingSeeker = await Seeker.findOne({ $or: [{ email }, { phone }] });
    if (existingSeeker) { 
      return res.redirect(
        "/register?error=Email or phone number already registered!"
      );
    }

    // Hash the password before saving (security best practice)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newSeeker = new Seeker({
      name,
      email,
      phone,
      password:hashedPassword,  // You should hash the password before saving!
      address,
      state,
      city,
      zipCode,
      age,
      gender,
      occupation
    });

    await newSeeker.save();
    console.log(req.body);
    res.status(201).redirect("/login");

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error saving seeker data" });
  }
};
