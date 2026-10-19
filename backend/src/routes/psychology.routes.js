import express from "express";
import {
  createEntry,
  getEntries,
  updateEntry,
  deleteEntry,
} from "../controllers/psychology.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getEntries).post(createEntry);
router.route("/:id").put(updateEntry).delete(deleteEntry);

export default router;