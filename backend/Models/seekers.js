import mongoose from "mongoose";

// Seeker Schema
const SeekerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    occupation: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Seeker", SeekerSchema);
