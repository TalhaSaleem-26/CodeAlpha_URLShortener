import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.mongourl);
    console.log(" MongoDB connected");
  } catch (err) {
    console.error(" DB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
