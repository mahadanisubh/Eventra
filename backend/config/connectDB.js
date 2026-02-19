import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to Mongodb");
  } catch (err) {
    console.error(err);
  }
};

export default connectDB;