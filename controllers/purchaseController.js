import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getPurchases = async (req, res) => {
  try {
    const purchases = await prisma.purchase.findMany({
      include: { items: true },
    });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPurchase = async (req, res) => {
  const { id } = req.params;
  try {
    const purchase = await prisma.purchase.findUnique({
      where: { id: parseInt(id) },
      include: { items: true },
    });
    res.json(purchase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPurchase = async (req, res) => {
  const { supplierId, date, invoiceNo, total } = req.body;
  try {
    const newPurchase = await prisma.purchase.create({
      data: { supplierId, date: new Date(date), invoiceNo, total },
    });
    // activity add karo
    await prisma.activity.create({
      data: {
        action: `New purchase added: Invoice ${invoiceNo} - $${total}`,
      }
    });

    res.status(201).json(newPurchase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePurchase = async (req, res) => {
  const { id } = req.params;
  const { supplierId, date, invoiceNo, total } = req.body;
  try {
    const updatedPurchase = await prisma.purchase.update({
      where: { id: parseInt(id) },
      data: { supplierId, date: new Date(date), invoiceNo, total },
    });
    res.json(updatedPurchase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePurchase = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.purchase.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Purchase deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
