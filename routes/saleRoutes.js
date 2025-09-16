import express from 'express';
import {
  getSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
} from '../controllers/saleController.js';

const router = express.Router();

router.get('/', getSales);          // All sales
router.get('/:id', getSaleById);    // Single sale
router.post('/', createSale);       // Create sale
router.put('/:id', updateSale);     // Update sale
router.delete('/:id', deleteSale);  // Delete sale

export default router;
