import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_CONNECTION_LINK);
    console.log(`MongoDB connected :${connect.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
