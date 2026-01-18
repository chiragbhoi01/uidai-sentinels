import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`\nMongoDB connected! DB HOST: ${connectionInstance.connection.host}, DB NAME: ${connectionInstance.connection.name}`);
    } catch (error) {
        console.error("MONGODB connection FAILED !!!", error);
        process.error("MongoDB connection failed, exiting process: ", error);
        process.exit(1);
    }
}

export default connectDB;