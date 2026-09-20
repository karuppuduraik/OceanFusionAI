const mongoose = require("mongoose");
const dns = require("dns");

// Ensure reliable SRV DNS resolution for MongoDB Atlas on Windows environments
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Fallback if environment restricts custom DNS servers
}

const connectDB = async () => {
  try {
    console.log("Using Mongo URI:");
    console.log(process.env.MONGODB_URI);

    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected");
    console.log("Host:", conn.connection.host);
    console.log("Database:", conn.connection.name);

  } catch (err) {
    console.error("❌ MongoDB ERROR");
    console.error(err);
  }
};

module.exports = connectDB;
