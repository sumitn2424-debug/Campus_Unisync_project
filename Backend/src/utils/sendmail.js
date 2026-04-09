// src/utils/sendMail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4, // Force IPv4
  connectionTimeout: 5000, // 5 seconds
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const sendMail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text,
    });
    console.log("✅ Email sent successfully:", info.messageId);
    return { success: true, info };
  } catch (error) {
    console.error("❌ SendMail Error Details:");
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    console.error("Check your EMAIL and APP_PASSWORD environment variables on Render.");
    return { success: false, error: error.message };
  }
};

module.exports = sendMail;