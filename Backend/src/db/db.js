const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            family: 4
        });

        console.log("✅ MongoDB Connected");
        console.log("Host:", conn.connection.host);
        console.log("DB Name:", conn.connection.name);
        console.log("Connection State:", mongoose.connection.readyState);
    } catch (error) {
        console.error("❌ MongoDB Error:", error.message);
    }
};


module.exports = { connectDB};
