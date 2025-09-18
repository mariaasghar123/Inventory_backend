// controllers/profitLossController.js
import prisma from '../prisma/client.js';

export const getProfitLoss = async (req, res) => {
  try {
    // ✅ Role check yahan
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admins only' });
    }

    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // 1️⃣ Total Sales
    const salesData = await prisma.sale.aggregate({
      _sum: { total: true, discount: true },
      where: { date: { gte: start, lte: end } }
    });
    const totalSales = salesData._sum.total || 0;
    const totalDiscounts = salesData._sum.discount || 0;

    // 2️⃣ Total Returns
    const returnsData = await prisma.return.aggregate({
      _sum: { refundAmount: true },
      where: { sale: { date: { gte: start, lte: end } } }
    });
    const totalReturns = returnsData._sum.refundAmount || 0;

    // 3️⃣ Expenses
    const expenseData = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: { date: { gte: start, lte: end } }
    });
    const totalExpenses = expenseData._sum.amount || 0;

    // 4️⃣ COGS (FIFO)
    const soldItems = await prisma.saleItem.findMany({
      where: { sale: { date: { gte: start, lte: end } } },
      include: { product: true }
    });

    let totalCOGS = 0;

    for (const item of soldItems) {
      let qtyToDeduct = item.qty;

      const purchaseBatches = await prisma.purchaseItem.findMany({
        where: { productId: item.productId },
        orderBy: { id: 'asc' } // FIFO
      });

      for (let batch of purchaseBatches) {
        if (qtyToDeduct <= 0) break;

        if (batch.qty >= qtyToDeduct) {
          totalCOGS += qtyToDeduct * batch.costPrice;
          batch.qty -= qtyToDeduct;
          qtyToDeduct = 0;
        } else {
          totalCOGS += batch.qty * batch.costPrice;
          qtyToDeduct -= batch.qty;
          batch.qty = 0;
        }
      }
    }

    // 5️⃣ Profit
    const profit = (totalSales - totalReturns - totalDiscounts) - (totalCOGS + totalExpenses);

    res.json({
      totalSales,
      totalDiscounts,
      totalReturns,
      totalCOGS,
      totalExpenses,
      profit
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to fetch Profit & Loss' });
  }
};
