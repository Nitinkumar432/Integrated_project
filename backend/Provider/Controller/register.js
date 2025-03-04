import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // For JWT authentication
import Provider from "../../Models/provideschema.js";  

// export const registerProvider = async (req, res) => {
//   console.log("🔹 Register Provider API hit!"); // ✅ Confirm route is hit
//   console.log("Received Data:", req.body); // ✅ Log incoming request

//   try {
//     const { 
//       name, email, phone, password, skills, experience, certifications, 
//       gstNumber, governmentProof, serviceLocation, availability, pricingDetails 
//     } = req.body;

//     // Ensure required fields are provided
//     if (!name || !email || !phone || !password || !experience || !gstNumber || !governmentProof || !serviceLocation || !availability) {
//       console.log("❌ Missing required fields!");
//       return res.status(400).json({ error: "All required fields must be filled!" });
//     }

//     // Check if email or phone already exists
//     const existingProvider = await Provider.findOne({ $or: [{ email }, { phone }] });
//     if (existingProvider) {
//       console.log("❌ Email or phone already exists!");
//       return res.redirect("/register?error=Email or phone number already registered!");
//     }

//     // Hash the password before saving (security best practice)
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newProvider = new Provider({
//       name,
//       email,
//       phone,
//       password: hashedPassword,
//       skills,
//       experience,
//       certifications,
//       gstNumber,
//       governmentProof,
//       serviceLocation,
//       availability,
//       pricingDetails
//     });

//     console.log("🆕 New Provider Data:", newProvider);

//     await newProvider.save();
//     console.log("✅ Provider successfully registered!");

//     res.status(201).redirect("/login");

//   } catch (error) {
//     console.error("❌ Error saving provider data:", error);
//     res.status(500).json({ error: "Error saving provider data" });
//   }
// };


export const registerProvider = async (req, res) => {
    console.log("🔹 Register Provider API hit!");
    console.log("Received Data:", req.body);
  
    try {
      let { 
        name, email, phone, password, skills, experience, certifications, 
        gstNumber, governmentProof, serviceLocation, availability, pricingDetails 
      } = req.body;
  
      // Ensure required fields are provided
      if (!name || !email || !phone || !password || !experience || !gstNumber || !governmentProof || !serviceLocation || !availability) {
        console.log("❌ Missing required fields!");
        return res.status(400).json({ error: "All required fields must be filled!" });
      }
  
      // Convert experience to a number
      experience = parseInt(experience); // ✅ Ensure it’s a number
  
      if (isNaN(experience)) {
        console.log("❌ Invalid experience format!");
        return res.status(400).json({ error: "Experience must be a number!" });
      }
  
      // Check if email or phone already exists
      const existingProvider = await Provider.findOne({ $or: [{ email }, { phone }] });
      if (existingProvider) {
        console.log("❌ Email or phone already exists!");
        return res.redirect("/register?error=Email or phone number already registered!");
      }
  
      // Hash the password before saving (security best practice)
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newProvider = new Provider({
        name,
        email,
        phone,
        password: hashedPassword,
        skills,
        experience, // ✅ Now it's stored as a number
        certifications,
        gstNumber,
        governmentProof,
        serviceLocation,
        availability,
        pricingDetails
      });
  
      console.log("🆕 New Provider Data:", newProvider);
  
      await newProvider.save();
      console.log("✅ Provider successfully registered!");
  
      // res.status(201).redirect("/login");
      res.status(201).json({message :"successfully registered"});
  
    } catch (error) {
      console.error("❌ Error saving provider data:", error);
      res.status(500).json({ error: "Error saving provider data" });
    }
  };
  