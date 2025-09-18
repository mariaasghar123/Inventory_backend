// src/server.js
import express from "express";
import cors from "cors";
import prisma from "./prisma/client.js";

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import stockBatchRoutes from './routes/stockBatchRoutes.js';
import saleRoutes from './routes/saleRoutes.js';
import saleItemRoutes from './routes/saleItemRoutes.js';

import expenseRoutes from './routes/expenses.js';
import returnRoutes from './routes/returns.js';
import purchaseRoutes from './routes/purchases.js';
import purchaseItemRoutes from './routes/purchaseItems.js';
import dashboardRoutes from './routes/dashbaord.js';
import authRoutes from './routes/authRoutes.js';
// import profitlossRoutes from "./routes/profitlossRoutes.js";
import profitlossRoutes from './routes/profitlossRoutes.js';


const app = express();

// ✅ CORS config — allow both local & production URLs
const allowedOrigins = [
  "http://localhost:5173",
  "https://inventory-system-utb5.vercel.app",
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("POS Backend Running ✅");
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stockbatches', stockBatchRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/saleitems', saleItemRoutes);
app.use('/api/returns', returnRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/purchaseitems', purchaseItemRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profit-loss', profitlossRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
