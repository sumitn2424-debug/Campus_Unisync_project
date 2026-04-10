const {Resend} = require("resend");

// Prevent server crash if API key is missing in production by providing a dummy key
const apiKey = process.env.RESEND_API_KEY || "re_dummy_key_to_prevent_crash";
const resend = new Resend(apiKey);

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    // If no real API key is configured, just mock the email sending securely.
    if (!process.env.RESEND_API_KEY) {
      console.log(`\n[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
      console.log(`[MOCK EMAIL CONTENT]: ${html || text}\n`);
      return { success: true, mock: true };
    }

    const data = await resend.emails.send({
      from: process.env.SMTP_EMAIL || "onboarding@resend.dev", 
      to,
      subject,
      html: html || text,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Email error:", error);
    // Do not throw so we don't crash requests; just return a failure gracefully
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;