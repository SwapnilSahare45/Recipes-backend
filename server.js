import express from "express";
import dotenv from "dotenv";
import { dbConnect } from "./config/dbConnection.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import recipeRouter from "./routes/recipeRoutes.js";


// Create instance of express to handle routes, middleware, http requests etc
const app = express();

// Configuration file to load environment variable
dotenv.config();


// Middleware to parse incoming requests with json payloads. Also used to handle json data
app.use(express.json());

// Cross-Origin Resource Sharing (CORS) middleware enables requests from different domains
app.use(cors());

// Function to start server
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