import express from "express";
import { userLogin, userProfile, userRegister } from "../controllers/userController.js";
import { protectRoute } from "../middleware/protectRouteMiddleware.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/profile", userProfile);

export default router;