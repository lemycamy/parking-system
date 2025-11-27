import mongoose from "mongoose";

const parkingSchema = new mongoose.Schema({
  slotNumber: { type: String, required: true },
  plateNumber: { type: String, required: true },
  ownerName: { type: String, required: true },
  vehicleType: { type: String, default: "Car" },
  timeIn: { type: Date, required: true },
  timeOut: { type: Date, default: null },
  totalHours: { type: Number, default: 0 },
  ratePerHour: { type: Number, default: 50 },
  totalFee: { type: Number, default: 0 },
  status: { type: String, default: "pending" },
  isCustomer: { type: Boolean, default: false },
  date: { type: String },
  createdBy: { type: String },
  entryType: { type: String, enum: ["Walk-in", "Booked"], default: "Walk-in" },
}, { collection: "parkingRecords" });

export default mongoose.models.ParkingRecord || mongoose.model("ParkingRecord", parkingSchema);
