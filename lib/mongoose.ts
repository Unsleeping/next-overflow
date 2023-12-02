import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    console.log("Missing MONGODB_URL environment variable");
    return;
  }

  if (isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "NextOverflowCluster0",
    });
    isConnected = true;
    console.log("MongoDB is connected");
  } catch (e) {
    console.log("MongoDB connection error:", e);
  }
};
