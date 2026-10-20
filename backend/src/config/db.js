import dns from "dns";
import mongoose from "mongoose";

// some home networks block the lookup Atlas needs, so locally we use Google DNS
// on Render NODE_ENV is "production", so this is skipped
if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

// connects to MongoDB using the link from .env
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // stop the server if the database is not working
  }
};

export default connectDB;