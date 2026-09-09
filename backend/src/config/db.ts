import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(env.mongodbUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  console.log("MongoDB disconnected");
};
