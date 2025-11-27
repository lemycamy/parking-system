// backend/disableCslots.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import ParkingSlot from "./models/ParkingSlot.js";

dotenv.config();

const MONGO = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smartparking";

async function disableCSlots() {
  try {
    await mongoose.connect(MONGO);
    console.log("Connected to MongoDB");

    const result = await ParkingSlot.updateMany(
      { section: "C" },
      { $set: { status: "occupied" } }
    );

    console.log(`✅ Updated ${result.modifiedCount} C slots to unavailable`);
    process.exit(0);
  } catch (err) {
    console.error("Error updating C slots:", err);
    process.exit(1);
  }
}

disableCSlots();
