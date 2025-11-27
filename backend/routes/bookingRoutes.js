import express from "express";
import Booking from "../models/Booking.js";
import ParkingSlot from "../models/ParkingSlot.js";
import ParkingRecord from "../models/ParkingRecord.js";

const router = express.Router();

router.post("/", async (req, res) => {
  let { name, plate, slot, type, startTime, endTime } = req.body;

  try {
    const emptySlots = await ParkingSlot.find({ status: "empty" }).sort({ section: -1, position: 1 });
    if (!slot) {
      const assignedSlot = emptySlots[0];
      if (!assignedSlot) return res.status(400).json({ message: "No available slots" });
      slot = assignedSlot.number;
    }

    const slotExists = await ParkingSlot.findOne({ number: slot });
    if (!slotExists) return res.status(404).json({ message: "Slot not found" });
    if (slotExists.status === "occupied") return res.status(400).json({ message: "Slot already occupied" });

    const booking = new Booking({ name, plate, slot, type, startTime, endTime });
    await booking.save();

    slotExists.status = "occupied";
    await slotExists.save();

    // Create ParkingRecord for booked entry
    const record = new ParkingRecord({
      slotNumber: slot,
      plateNumber: plate.toUpperCase(),
      ownerName: name,
      vehicleType: type,
      timeIn: startTime || new Date(),
      date: new Date().toISOString().split("T")[0],
      createdBy: name,
      ratePerHour: 50,
      entryType: "Booked",
    });
    await record.save();

    res.json({ message: "Booking created", booking, parkingRecord: record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
