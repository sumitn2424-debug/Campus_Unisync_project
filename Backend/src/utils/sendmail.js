// src/utils/sendMail.js
const https = require("https");

/**
 * Sends an email using Brevo's High-Speed REST API.
 * This is 10x faster than SMTP and bypasses cloud firewall blocks.
 */
const sendMail = async (to, subject, text) => {
  // Use the names you just set in your .env
  const apiKey = process.env.SMTP_APP_PASSWORD; 
  const senderEmail = process.env.SMTP_EMAIL;

  if (!apiKey || !senderEmail) {
    console.error("❌ High-Speed API Error: SMTP_APP_PASSWORD or SMTP_EMAIL missing from .env");
    return { success: false, error: "Email configuration missing." };
  }

  const data = JSON.stringify({
    sender: { email: senderEmail, name: "UniSync" },
    to: [{ email: to }],
    subject: subject,
    textContent: text,
  });

  const options = {
    hostname: "api.brevo.com",
    path: "/v3/smtp/email",
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
      "Content-Length": Buffer.byteLength(data),
    },
    timeout: 5000, 
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let responseData = "";
      res.on("data", (chunk) => { responseData += chunk; });
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log("🚀 Email sent via High-Speed API!");
          resolve({ success: true, data: responseData });
        } else {
          console.error("❌ Brevo API Error Status:", res.statusCode);
          console.error("Response:", responseData);
          resolve({ success: false, error: `API Error: ${res.statusCode}` });
        }
      });
    });

    req.on("error", (error) => {
      console.error("❌ Network Error during API call:", error.message);
      resolve({ success: false, error: error.message });
    });

    req.on("timeout", () => {
      req.destroy();
      console.error("❌ Brevo API Connection Timed Out!");
      resolve({ success: false, error: "Connection Timeout" });
    });

    req.write(data);
    req.end();
  });
};

module.exports = sendMail;