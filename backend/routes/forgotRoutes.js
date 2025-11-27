import express from "express";
import ForgotRequest from "../models/ForgotRequest.js";

const router = express.Router();

// Create request
router.post("/request", async (req, res) => {
  try {
    const { username, contactInfo, message } = req.body;

    const reqDoc = new ForgotRequest({
      staffUsername: username,
      contactInfo: contactInfo || "",
      message,
      handled: false
    });

    await reqDoc.save();
    res.json({ message: "Request submitted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all requests
router.get("/all", async (req, res) => {
  try {
    const requests = await ForgotRequest.find();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark resolved
router.put("/resolve/:id", async (req, res) => {
  try {
    await ForgotRequest.findByIdAndUpdate(req.params.id, { handled: true, handledAt: new Date() });
    res.json({ message: "Resolved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
