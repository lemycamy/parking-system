import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Test connection
transporter.verify((error, success) => {
  if (error) console.log("Mailer error:", error);
  else console.log("Mailer ready to send messages");
});

export const sendBookingEmail = async ({ email, slotNumber, plateNumber, ownerName, reservationDate, timeIn, timeOut }) => {
  const mailOptions = {
    from: `"Smart Parking" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Parking Slot Booking Confirmation - ${slotNumber}`,
    html: `
      <h2>Booking Confirmed!</h2>
      <p><strong>Owner:</strong> ${ownerName}</p>
      <p><strong>Plate:</strong> ${plateNumber}</p>
      <p><strong>Slot:</strong> ${slotNumber}</p>
      <p><strong>Date:</strong> ${reservationDate}</p>
      <p><strong>Time In:</strong> ${new Date(timeIn).toLocaleString()}</p>
      <p><strong>Time Out:</strong> ${timeOut ? new Date(timeOut).toLocaleString() : "Waiting for exit"}</p>
      <p>Show this QR code at the entrance.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Booking email sent:", info.response);
    return true;
  } catch (err) {
    console.error("Error sending booking email:", err);
    throw err;
  }
};
