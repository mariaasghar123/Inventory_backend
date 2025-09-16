import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get all returns
export const getReturns = async (req, res) => {
  try {
    const returns = await prisma.return.findMany({
      include: { sale: true, product: true },
    });
    res.json(returns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single return
export const getReturn = async (req, res) => {
  const { id } = req.params;
  try {
    const returnItem = await prisma.return.findUnique({
      where: { id: parseInt(id) },
      include: { sale: true, product: true },
    });
    res.json(returnItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create return
export const createReturn = async (req, res) => {
  const { saleId, productId, qty, reason, refundAmount } = req.body;
  try {
    const newReturn = await prisma.return.create({
      data: { saleId, productId, qty, reason, refundAmount },
    });
    res.status(201).json(newReturn);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update return
export const updateReturn = async (req, res) => {
  const { id } = req.params;
  const { saleId, productId, qty, reason, refundAmount } = req.body;
  try {
    const updatedReturn = await prisma.return.update({
      where: { id: parseInt(id) },
      data: { saleId, productId, qty, reason, refundAmount },
    });
    res.json(updatedReturn);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete return
export const deleteReturn = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.return.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Return deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
