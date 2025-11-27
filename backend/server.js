import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

// Routes
import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import parkingSlotRoutes from "./routes/parkingSlotRoutes.js";
import parkingRoutes from "./routes/parkingRoutes.js";
import sendBookingEmailRoute from "./routes/sendBookingEmail.js";

// Utils & Models
import { generateQRCode } from "./utils/generateQRCode.js";
import ParkingRecord from "./models/parkingRecord.js"; // make sure the filename matches exactly

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ---------------- Middleware ----------------
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// ---------------- Routes ----------------

app.use("/api/parkingRecord", parkingRoutes);
app.use("/api/parking-slots", parkingSlotRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/sendBookingEmail", sendBookingEmailRoute);

// Test root
app.get("/", (req, res) => res.send("Smart Parking API is running"));

// ---------------- MongoDB Connection ----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ---------------- Booking Email ----------------
app.post("/sendBookingEmail", async (req, res) => {
  try {
    const { email, slotNumber, plateNumber, ownerName, timeIn, timeOut } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const qrData = `Slot: ${slotNumber}\nPlate: ${plateNumber}\nOwner: ${ownerName}\nTime In: ${timeIn}\nTime Out: ${timeOut}`;
    const qrUrl = await generateQRCode(qrData);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Your Richmond Square Parking Booking",
      html: `
        <h3>Booking Confirmed!</h3>
        <p>Slot: ${slotNumber}</p>
        <p>Plate: ${plateNumber}</p>
        <p>Time In: ${timeIn}</p>
        <p>Time Out: ${timeOut || "N/A"}</p>
        <img src="${qrUrl}" alt="QR Code"/>
        <p>Show this QR code upon arrival.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("❌ Email send error:", err);
    res.status(500).json({ message: "Error sending email" });
  }
});

// ---------------- Start Server ----------------
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
