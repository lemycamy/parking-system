import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  amount: { type: Number, required: true },
  method: { type: String, enum: ["gcash", "cash"], default: "gcash" },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
