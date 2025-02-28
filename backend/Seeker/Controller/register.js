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
      return res.status(400).json({ error: "Email or phone number already registered!" });
    }

    const newSeeker = new Seeker({
      name,
      email,
      phone,
      password,  // You should hash the password before saving!
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
    res.status(201).json({ message: "Seeker registered successfully!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error saving seeker data" });
  }
};
