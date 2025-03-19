import mongoose from "mongoose";

// Connect to database
export const dbConnect = async () => {
    try {
        // check the mogno url is present or not in the .env file
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL is not defined in the environment variable");
        }

        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Database connected: ${conn.connection.host}`);
        return conn;
        
    } catch (error) {
        console.log(`Error connecting to database: ${error.message}`);
        process.exit(1);
    }
}