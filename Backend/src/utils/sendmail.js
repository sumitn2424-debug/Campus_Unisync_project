const nodemailer = require("nodemailer");

const sendMail = async (to, subject, text) => {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_APP_PASSWORD) {
    console.error("❌ SMTP_EMAIL or SMTP_APP_PASSWORD missing in .env");
    return { success: false, error: "Email config missing" };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_APP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"UniSync" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      text,
    });

    console.log("🚀 Email sent:", info.messageId);
    return { success: true, data: info };
  } catch (err) {
    console.error("❌ Error sending email:", err.message);
    return { success: false, error: err.message };
  }
};

module.exports = sendMail;