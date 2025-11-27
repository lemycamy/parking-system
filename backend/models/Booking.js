import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  plate: { type: String, required: true },
  slot: { type: Number, required: true },
  type: { type: String, enum: ["reservation", "walk-in"], default: "reservation" },
  startTime: { type: Date, default: null },
  endTime: { type: Date, default: null },
});

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
