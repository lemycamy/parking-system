import express from "express";
import ParkingSlot from "../models/ParkingSlot.js";

const router = express.Router();

// GET all slots
router.get("/", async (req, res) => {
  try {
    const slots = await ParkingSlot.find();
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new slot
router.post("/", async (req, res) => {
  try {
    const newSlot = new ParkingSlot(req.body);
    await newSlot.save();
    res.json({ message: "New slot created", slot: newSlot });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE slot
router.put("/:id", async (req, res) => {
  try {
    const slot = await ParkingSlot.findById(req.params.id);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    Object.assign(slot, req.body);
    await slot.save();
    res.json({ message: "Slot updated", slot });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// INITIALIZE slots
router.post("/init", async (req, res) => {
  try {
    const slots = [];
    for (let i = 1; i <= 25; i++) {
      slots.push(new ParkingSlot({ number: i, status: "empty" }));
    }
    await ParkingSlot.insertMany(slots);
    res.json({ message: "Parking slots initialized", slots });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
