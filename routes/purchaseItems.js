import express from "express";
import {
  getPurchaseItems,
  getPurchaseItem,
  createPurchaseItem,
  updatePurchaseItem,
  deletePurchaseItem,
} from "../controllers/purchaseItemController.js";

const router = express.Router();

router.get("/", getPurchaseItems);
router.get("/:id", getPurchaseItem);
router.post("/", createPurchaseItem);
router.put("/:id", updatePurchaseItem);
router.delete("/:id", deletePurchaseItem);

export default router;
