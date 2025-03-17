import express from "express";
import dotenv from "dotenv";
import { dbConnect } from "./config/dbConnection.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import recipeRouter from "./routes/recipeRoutes.js";

// Creating server
const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());

// function to start server
const startServer = async () => {
    try {
        await dbConnect();

        app.use("/api/user", userRoutes);
        app.use("/api/recipe", recipeRouter);

        const port = process.env.PORT || 4500;
        app.listen(port, () => {
            console.log(`Server running on the port ${port}`);
        })
    } catch (error) {
        console.log("Error starting server", error.message);
        process.exit(1);
    }
}

startServer();