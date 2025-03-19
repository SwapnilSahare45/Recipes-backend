import express from "express";
import { addRecipe, myRecipes, recipeById, searchRecipes, showAllRecipe } from "../controllers/recipeController.js";
import multer from "multer";
import { protectRoute } from "../middleware/protectRouteMiddleware.js";

// Create a new router object
const router = express.Router();

// Create a new instance of multer storage that stores the file in memory as a buffer object
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes for handling different http requests
router.post("/addRecipe", protectRoute, upload.single("recipeImage"), addRecipe);
router.get("/allRecipes", protectRoute, showAllRecipe);
router.get("/recipeById/:id", protectRoute, recipeById);
router.get("/myRecipes", protectRoute, myRecipes);
router.get("/search/:key", protectRoute, searchRecipes);

export default router;