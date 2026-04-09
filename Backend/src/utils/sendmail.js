// src/utils/sendMail.js
const https = require("https");

/**
 * Sends an email using Brevo's High-Speed REST API.
 * This is 10x faster than SMTP and bypasses cloud firewall blocks.
 */
const sendMail = async (to, subject, text) => {
  if (!process.env.BREVO_KEY || !process.env.BREVO_USER) {
    console.error("❌ API Error: BREVO_KEY or BREVO_USER is missing from .env");
    return { success: false, error: "Email configuration missing." };
  }

  const data = JSON.stringify({
    sender: { email: process.env.BREVO_USER, name: "UniSync" },
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
      "api-key": process.env.BREVO_KEY,
      "content-type": "application/json",
      "Content-Length": data.length,
    },
    timeout: 5000, // 5 seconds
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