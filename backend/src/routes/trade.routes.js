import express from "express";
import {
  createTrade,
  getTrades,
  getTrade,
  updateTrade,
  deleteTrade,
} from "../controllers/trade.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadScreenshot } from "../middleware/upload.middleware.js";

const router = express.Router();

router.use(protect);

// uploadScreenshot runs before the controller and reads the file
router.route("/").get(getTrades).post(uploadScreenshot, createTrade);
router
  .route("/:id")
  .get(getTrade)
  .put(uploadScreenshot, updateTrade)
  .delete(deleteTrade);

export default router;