import mongoose from "mongoose";

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