import express from "express";
import {
  createStrategy,
  getStrategies,
  updateStrategy,
  deleteStrategy,
} from "../controllers/strategy.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getStrategies).post(createStrategy);
router.route("/:id").put(updateStrategy).delete(deleteStrategy);

export default router;