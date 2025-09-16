import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getPurchaseItems = async (req, res) => {
  try {
    const items = await prisma.purchaseItem.findMany({
      include: { purchase: true, product: true },
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPurchaseItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await prisma.purchaseItem.findUnique({
      where: { id: parseInt(id) },
      include: { purchase: true, product: true },
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPurchaseItem = async (req, res) => {
  const { purchaseId, productId, qty, costPrice } = req.body;
  try {
    const newItem = await prisma.purchaseItem.create({
      data: { purchaseId, productId, qty, costPrice },
    });
    // activity add karo
    await prisma.activity.create({
      data: {
        action: `New purchase item added: Product ID ${productId} - Qty: ${qty} at $${costPrice}`,
      }
    });
    
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePurchaseItem = async (req, res) => {
  const { id } = req.params;
  const { purchaseId, productId, qty, costPrice } = req.body;
  try {
    const updatedItem = await prisma.purchaseItem.update({
      where: { id: parseInt(id) },
      data: { purchaseId, productId, qty, costPrice },
    });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePurchaseItem = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.purchaseItem.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Purchase item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
