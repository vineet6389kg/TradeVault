import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  demoLogin,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/demo", demoLogin);
router.get("/me", protect, getMe); // protect runs first

export default router;