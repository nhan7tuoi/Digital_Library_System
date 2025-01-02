import mongoose from "mongoose";
import { env } from "../helper";
const ConnectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_DB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Failed to connect MongoDB: ", err.message);
  }
};

export default ConnectDB;
