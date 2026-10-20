import express from "express";
import {
  updateProfile,
  updateAvatar,
  removeAvatar,
  changePassword,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadAvatar } from "../middleware/upload.middleware.js";

const router = express.Router();

router.use(protect);

router.put("/profile", updateProfile);
router.put("/password", changePassword);
router.route("/avatar").put(uploadAvatar, updateAvatar).delete(removeAvatar);

export default router;