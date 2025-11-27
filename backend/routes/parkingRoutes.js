import express from "express";
import ParkingSlot from "../models/ParkingSlot.js";
import ParkingRecord from "../models/ParkingRecord.js";
import cron from "node-cron";

const router = express.Router();

// ---------------- Get all slots ----------------
router.get("/", async (req, res) => {
  try {
    const slots = await ParkingSlot.find().sort({ slotNumber: 1 });
    res.json(slots); // Always returns all slots
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- Initialize default 25 slots ----------------
router.post("/initSlots", async (req, res) => {
  try {
    const existing = await ParkingSlot.find();
    if (existing.length > 0) return res.json({ message: "Slots already initialized" });

    const slots = [];

    // Section A: 3 car slots, each can hold up to 3 motorcycles
    for (let i = 1; i <= 3; i++) {
      slots.push({
        slotNumber: `A${i}`,
        section: "A",
        vehicleType: "none",
        status: "empty",
        plateNumbers: [],
        motorCount: 0,
      });
    }

    // Section B: 8 car slots
    for (let i = 1; i <= 8; i++) {
      slots.push({
        slotNumber: `B${i}`,
        section: "B",
        vehicleType: "none",
        status: "empty",
        plateNumbers: [],
      });
    }

    // Section C: 8 car slots
    for (let i = 1; i <= 8; i++) {
      slots.push({
        slotNumber: `C${i}`,
        section: "C",
        vehicleType: "none",
        status: "empty",
        plateNumbers: [],
      });
    }

    await ParkingSlot.insertMany(slots);
    res.json({ message: "25 slots initialized successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- Check-in / Book a slot ----------------
router.post("/timein", async (req, res) => {
  try {
    const { slotNumber, plateNumber, ownerName, vehicleType, createdBy } = req.body;

    if (!slotNumber || !plateNumber || !ownerName || !vehicleType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const slot = await ParkingSlot.findOne({ slotNumber });
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    // Initialize plateNumbers array if undefined
    if (!Array.isArray(slot.plateNumbers)) slot.plateNumbers = [];

    // Section A motorcycle logic
    if (vehicleType === "Motorcycle" && slot.section === "A") {
      if (slot.motorCount >= 3) {
        return res.status(400).json({ message: "Section A car slot is full for motorcycles" });
      }
      slot.plateNumbers.push(plateNumber);
      slot.motorCount += 1;
      slot.status = "occupied";
    } else {
      if (slot.status === "occupied") {
        return res.status(400).json({ message: "Slot already occupied" });
      }
      slot.vehicleType = vehicleType;
      slot.plateNumbers = [plateNumber];
      slot.status = "occupied";
    }

    slot.timeIn = new Date();
    await slot.save();

    const parkingRecord = await ParkingRecord.create({
      slotNumber,
      plateNumber,
      ownerName,
      vehicleType,
      timeIn: slot.timeIn,
      createdBy,
      entryType: "Booked",
      status: "waiting",
    });

    res.json({ message: "Checked in successfully", parkingRecord, assignedSlot: slot });
  } catch (err) {
    console.error("Time-in error:", err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
});

router.post("/verify/:id", async (req, res) => {
  try {
    const { id } = req.params; // parkingRecord id
    const record = await ParkingRecord.findById(id);
    if (!record) return res.status(404).json({ message: "Booking not found" });

    record.status = "parked";
    const slot = await ParkingSlot.findOne({ slotNumber: record.slotNumber });
    slot.status = "occupied";
    await slot.save();
    await record.save();

    res.json({ message: "Booking verified, vehicle parked", record, slot });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// ---------------- Check-out / Exit ----------------
router.post("/timeout/:slotNumber", async (req, res) => {
  try {
    const { slotNumber } = req.params;
    const { plateNumber } = req.body;

    const slot = await ParkingSlot.findOne({ slotNumber });
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    const record = await ParkingRecord.findOne({ slotNumber, plateNumber, timeOut: null });
    if (!record) return res.status(404).json({ message: "Active parking record not found" });

    const now = new Date();
    record.timeOut = now;
    record.totalHours = Math.ceil((now - record.timeIn) / (1000 * 60 * 60));
    record.totalFee = record.totalHours * record.ratePerHour;
    record.status = "paid";

    // Remove vehicle from slot
    if (record.vehicleType === "Motorcycle" && slot.section === "A") {
      slot.plateNumbers = slot.plateNumbers.filter(p => p !== plateNumber);
      slot.motorCount -= 1;
      if (slot.motorCount === 0) slot.status = "empty";
    } else {
      slot.plateNumbers = [];
      slot.vehicleType = "none";
      slot.status = "empty";
      slot.occupant = null;
    }

    slot.timeOut = now;
    await slot.save();
    await record.save();

    res.json({ message: "Checked out successfully", record });
  } catch (err) {
    console.error("Error in /timeout:", err);
    res.status(500).json({ message: err.message });
  }
});


cron.schedule("*/5 * * * *", async () => {  // every 5 minutes
  const now = new Date();
  const lateBookings = await ParkingRecord.find({
    status: "waiting",
    timeIn: { $lt: new Date(now.getTime() - 30*60*1000) }
  });

  for (let record of lateBookings) {
    const slot = await ParkingSlot.findOne({ slotNumber: record.slotNumber });
    if (record.vehicleType === "Motorcycle" && slot.section === "A") {
      slot.motorCount = Math.max(slot.motorCount - 1, 0);
      if (slot.motorCount === 0) slot.status = "empty";
    } else {
      slot.status = "empty";
      slot.vehicleType = "none";
    }
    await slot.save();
    await record.deleteOne();
    console.log(`Removed late booking: ${record.plateNumber}`);
  }
});

export default router;
