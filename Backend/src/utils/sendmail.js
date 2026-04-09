// // src/utils/sendMail.js
// const nodemailer = require("nodemailer");

// const sendMail = async (to, subject, text) => {
//   if (!process.env.SMTP_EMAIL || !process.env.SMTP_APP_PASSWORD) {
//     console.error("❌ SMTP_EMAIL or SMTP_APP_PASSWORD missing in .env");
//     return { success: false, error: "Email config missing" };
//   }

//   try {
//     const transporter = nodemailer.createTransport({
//       port: 587 || 465,
//       host: "smtp.gmail.com",
//       // service: "gmail",
//       secure: true,
//       auth: {
//         user: process.env.SMTP_EMAIL,
//         pass: process.env.SMTP_APP_PASSWORD,
//       },
      
//       family: 4
//     });

//     const info = await transporter.sendMail({
//       from: `"UniSync" <${process.env.SMTP_EMAIL}>`,
//       to,
//       subject,
//       text,
//     });

//     console.log("🚀 Email sent:", info.messageId);
//     return { success: true, data: info };
//   } catch (err) {
//     console.error("❌ Error sending email:", err.message);
//     return { success: false, error: err.message };
//   }
// };

// module.exports = sendMail;


const axios = require("axios");

const sendMail = async (to, subject, text) => {
  try {
    const res = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: "demod2223@gmail.com", name: "Unisync" },
        to: [{ email: to }],
        subject,
        textContent: text,
      },
      {
        headers: { "api-key": process.env.BREVO_API_KEY }
      }
    );
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

module.exports = sendMail;