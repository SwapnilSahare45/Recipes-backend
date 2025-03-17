import express from "express";
import { addRecipe, myRecipes, searchRecipes, showAllRecipe } from "../controllers/recipeController.js";
import multer from "multer";
import {protectRoute} from "../middleware/protectRouteMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/addRecipe", protectRoute, upload.single("recipeImage"), addRecipe);
router.get("/allRecipes",protectRoute, showAllRecipe);
router.get("/myRecipes", protectRoute, myRecipes);
router.get("/search/:key", protectRoute, searchRecipes);

export default router;