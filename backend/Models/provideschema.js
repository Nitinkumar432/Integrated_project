// import mongoose from "mongoose";
// const ProviderSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     phone: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     skills: [{ type: String }], // List of repair skills
//     experience: { type: Number, required: true },
//     certifications: [{ type: String }], // Optional certifications
//     gstNumber: { type: String, required: true },
//     governmentProof: { type: String, required: true }, // e.g., Aadhaar, License, etc.
//     verificationStatus: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
//     serviceLocation: { type: String, required: true },
//     availability: { type: String, required: true }, // e.g., weekdays, weekends
//     pricingDetails: { type: String }, // Pricing model or cost estimate
//     ratings: { type: Number, min: 0, max: 5, default: 0 },
//     reviews: [{ userId: String, comment: String, rating: Number }],
//     createdAt: { type: Date, default: Date.now }
// });
// module.exports=mongoose.model("Provider", ProviderSchema);



import mongoose from "mongoose";

const ProviderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skills: [{ type: String }], // List of repair skills
    experience: { type: Number, required: true },
    certifications: [{ type: String }], // Optional certifications
    gstNumber: { type: String, required: true },
    governmentProof: { type: String, required: true }, // e.g., Aadhaar, License, etc.
    verificationStatus: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
    serviceLocation: { type: String, required: true },
    availability: { type: String, required: true }, // e.g., weekdays, weekends
    pricingDetails: { type: String }, // Pricing model or cost estimate
    ratings: { type: Number, min: 0, max: 5, default: 0 },
    reviews: [{ userId: String, comment: String, rating: Number }],
    createdAt: { type: Date, default: Date.now }
});

// ✅ Correct way to export
const Provider = mongoose.model("Provider", ProviderSchema);
export default Provider;
