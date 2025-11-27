import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

const resetAdmin = async () => {
  try {
    const username = "admin@smartparking.com";
    const password = "admin123";
    const role = "admin";

    // Delete existing admin if it exists
    await User.deleteOne({ username });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = await User.create({ username, password: hashedPassword, role });

    console.log("✅ Default admin reset:", {
      username: newAdmin.username,
      password, // plaintext for reference
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Error resetting admin:", err);
    process.exit(1);
  }
};

resetAdmin();
