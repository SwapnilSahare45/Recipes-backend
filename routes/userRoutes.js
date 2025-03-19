import express from "express";
import { userLogin, userProfile, userRegister } from "../controllers/userController.js";
import { protectRoute } from "../middleware/protectRouteMiddleware.js";

// Create a new router object
const router = express.Router();

// Router for handling different http requests
router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/profile", protectRoute, userProfile);

export default router;