const cron = require("node-cron");
const userModel = require("../models/user.model");

console.log("🔥 Cron file loaded");

cron.schedule("* * * * *", async () => {
  console.log("🧹 Running cleanup job...");

  try {
    const result = await userModel.deleteMany({
      isVerified: false,
      otpExpiry: { $lt: Date.now() }
    });

    console.log(`Deleted users: ${result.deletedCount}`);
  } catch (err) {
    console.error("❌ Cron error:", err.message);
  }
});