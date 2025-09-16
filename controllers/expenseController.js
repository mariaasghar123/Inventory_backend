import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getExpenses = async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await prisma.expense.findUnique({ where: { id: parseInt(id) } });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createExpense = async (req, res) => {
  const { category, amount, date, description, reminderDate } = req.body;
  try {
    const newExpense = await prisma.expense.create({
      data: { category, amount, date: new Date(date), description, reminderDate: reminderDate ? new Date(reminderDate) : null },
    });
    // activity add karo
    await prisma.activity.create({
      data: {
        action: `New expenses added: ${category} - $${amount}`,
      }
    });
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { category, amount, date, description, reminderDate } = req.body;
  try {
    const updatedExpense = await prisma.expense.update({
      where: { id: parseInt(id) },
      data: { category, amount, date: new Date(date), description, reminderDate: reminderDate ? new Date(reminderDate) : null },
    });
    res.json(updatedExpense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.expense.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
