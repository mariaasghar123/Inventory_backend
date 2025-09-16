import express from "express";
import {
  getReturns,
  getReturn,
  createReturn,
  updateReturn,
  deleteReturn,
} from "../controllers/returnController.js";

const router = express.Router();

router.get("/", getReturns);
router.get("/:id", getReturn);
router.post("/", createReturn);
router.put("/:id", updateReturn);
router.delete("/:id", deleteReturn);

export default router;
