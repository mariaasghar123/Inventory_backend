import express from 'express';
// import { getProfitLoss } from '../controllers/profitLossController';
import { getProfitLoss } from '../controllers/profitLossController.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

// GET /api/profit-loss?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get('/', protect, getProfitLoss);

export default router;
