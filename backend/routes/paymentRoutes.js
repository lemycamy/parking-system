import express from "express";
const router = express.Router();

// MOCK GCash only
router.post("/mock-gcash", (req, res) => {
  const { amount, bookingId } = req.body;

  if (!amount || !bookingId) {
    return res.status(400).json({ error: "Missing amount or bookingId" });
  }

  res.json({ success: true, message: "Mock GCash payment successful", bookingId });
});

export default router;
