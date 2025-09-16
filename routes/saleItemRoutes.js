import express from 'express';
import {
  getSaleItems,
  getSaleItemById,
  createSaleItem,
  updateSaleItem,
  deleteSaleItem
} from '../controllers/saleItemController.js';

const router = express.Router();

router.get('/', getSaleItems);
router.get('/:id', getSaleItemById);
router.post('/', createSaleItem);
router.put('/:id', updateSaleItem);
router.delete('/:id', deleteSaleItem);

export default router;
