import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER || "fortich.educ@gmail.com", // your Gmail
    pass: process.env.MAIL_PASS || "rded nsjj iqsw dtqi",     // your app password
  },
});

export const sendBookingEmail = async (req, res) => {
  try {
    const { email, slotNumber, plateNumber, ownerName, reservationDate, timeIn, timeOut } = req.body;

    const mailOptions = {
      from: `"Smart Parking" <${process.env.MAIL_USER || "lyle.damien17@gmail.com"}>`,
      to: email,
      subject: "Smart Parking Booking Confirmation",
      html: `
        <h3>Booking Confirmed!</h3>
        <p>Slot: ${slotNumber}</p>
        <p>Plate: ${plateNumber}</p>
        <p>Owner: ${ownerName}</p>
        <p>Reservation Date: ${reservationDate}</p>
        <p>Time In: ${timeIn}</p>
        <p>Time Out: ${timeOut || "N/A"}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Mailer error:", err);
    res.status(500).json({ message: "Failed to send email", error: err });
  }
};

export default sendBookingEmail;