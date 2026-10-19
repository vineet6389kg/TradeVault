import express from "express";
import {
  createTrade,
  getTrades,
  getTrade,
  updateTrade,
  deleteTrade,
} from "../controllers/trade.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// every trade route needs a login
router.use(protect);

router.route("/").get(getTrades).post(createTrade);
router.route("/:id").get(getTrade).put(updateTrade).delete(deleteTrade);

export default router;