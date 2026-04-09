// cleanup_db.js
require('dotenv').config();
const mongoose = require('mongoose');

const cleanup = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected!");

    const db = mongoose.connection.db;

    // List of collections that might be causing conflicts
    const collectionsToDrop = ['user', 'userdatas']; 

    for (const name of collectionsToDrop) {
      try {
        await db.collection(name).drop();
        console.log(`🗑️ Dropped collection: ${name}`);
      } catch (e) {
        if (e.codeName === 'NamespaceNotFound') {
          console.log(`ℹ️ Collection '${name}' doesn't exist, skipping.`);
        } else {
          console.error(`❌ Error dropping '${name}':`, e.message);
        }
      }
    }

    console.log("\n✨ Database Cleanup Finished! You can now sign up fresh.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Fatal Error during cleanup:", err.message);
    process.exit(1);
  }
};

cleanup();
