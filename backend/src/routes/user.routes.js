import express from "express";
import {
  updateProfile,
  updateAvatar,
  removeAvatar,
  changePassword,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { blockDemo } from "../middleware/demo.middleware.js";
import { uploadAvatar } from "../middleware/upload.middleware.js";

const router = express.Router();

router.use(protect);

router.put("/profile", blockDemo, updateProfile);
router.put("/password", blockDemo, changePassword);
router
  .route("/avatar")
  .put(blockDemo, uploadAvatar, updateAvatar)
  .delete(blockDemo, removeAvatar);

export default router;