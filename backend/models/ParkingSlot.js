import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  slotNumber: String,       // e.g., "A1", "B2", "MC-1"
  section: String,          // "A", "B", "C", "MCDo"
  vehicleType: {            // current vehicle type
    type: String,
    default: "none",
  },
  status: {                 // "empty" or "occupied"
    type: String,
    default: "empty",
  },
  plateNumbers: {           // array for multiple motorcycles
    type: [String],
    default: [],
  },
  occupant: { type: String, default: null }, // owner name
  timeIn: { type: Date, default: null },
  timeOut: { type: Date, default: null },
  motorCount: { type: Number, default: 0 },  // only for section A car slots
});

export default mongoose.model("ParkingSlot", slotSchema);
