// src/utils/sendMail.js
const nodemailer = require("nodemailer");
const dns = require("dns");

// Force Node.js to prioritize IPv4 (still good practice on cloud)
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_KEY,
  },
});

const sendMail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.BREVO_USER,
      to,
      subject,
      text,
    });
    console.log("✅ Email sent via Brevo:", info.messageId);
    return { success: true, info };
  } catch (error) {
    console.error("❌ Brevo SMTP Error:");
    console.error("Message:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendMail;