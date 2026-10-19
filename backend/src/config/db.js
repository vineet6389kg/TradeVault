import dns from "dns";
import mongoose from "mongoose";

// use Google DNS, because some networks block the lookup MongoDB Atlas needs
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// connects to MongoDB using the link from .env
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;