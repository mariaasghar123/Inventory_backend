import express from 'express';
import {
  getStockBatches,
  createStockBatch,
  updateStockBatch,
  deleteStockBatch,
  getStockBatchById
} from '../controllers/stockBatchController.js';

const router = express.Router();

// Read all batches
router.get('/', getStockBatches);

// Create new batch
router.post('/', createStockBatch);
// Get single batch by ID
router.get('/:id', getStockBatchById);

// Update batch by id
router.put('/:id', updateStockBatch);

// Delete batch by id
router.delete('/:id', deleteStockBatch);

export default router;
