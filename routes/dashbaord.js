import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const router = Router();
const prisma = new PrismaClient();

// 🟩 GET /api/dashboard/recent-activities
// 🟩 GET /api/dashboard/recent-activities
router.get('/recent-activities', async (req, res) => {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { created_at: 'desc' },
      take: 3, // sirf last 3 activities
      select: {
        action: true,
        created_at: true
      }
    });

    res.json(
      activities.map(a => ({
        action: a.action,
        time: a.created_at
      }))
    );
  } catch (err) {
    console.error("Error fetching activities:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


// 🟩 Monthly Chart Data API
router.get("/chart-data", async (req, res) => {
  try {
    // Sales totals by month
    const sales = await prisma.sale.groupBy({
      by: ["date"], // assumes you have a date field
      _sum: { total: true },
    });

    // Purchases totals by month
    const purchases = await prisma.purchase.groupBy({
      by: ["date"],
      _sum: { total: true },
    });

    // Expenses totals by month
    const expenses = await prisma.expense.groupBy({
      by: ["date"],
      _sum: { amount: true },
    });

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const salesByMonth = sales.map(s => {
      const m = new Date(s.date).getMonth();
      return { month: monthNames[m], total: s._sum.total || 0 };
    });
    const purchasesByMonth = purchases.map(p => {
      const m = new Date(p.date).getMonth();
      return { month: monthNames[m], total: p._sum.total || 0 };
    });
    const expensesByMonth = expenses.map(e => {
      const m = new Date(e.date).getMonth();
      return { month: monthNames[m], total: e._sum.amount || 0 };
    });

    const months = [...new Set([
      ...salesByMonth.map(s => s.month),
      ...purchasesByMonth.map(p => p.month),
      ...expensesByMonth.map(e => e.month),
    ])];

    const chartData = months.map(m => ({
      month: m,
      sales: salesByMonth.find(s => s.month === m)?.total || 0,
      purchases: purchasesByMonth.find(p => p.month === m)?.total || 0,
      expenses: expensesByMonth.find(e => e.month === m)?.total || 0,
    }));

    res.json(chartData);
  } catch (error) {
    console.error("Chart data error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
