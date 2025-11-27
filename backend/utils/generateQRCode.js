import QRCode from "qrcode";

export const generateQRCode = async (text) => {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    console.error("❌ QR Code generation error:", err);
    return null;
  }
};
  