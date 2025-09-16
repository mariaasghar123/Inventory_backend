import prisma from '../prisma/client.js';

// ✅ Get all sale items
export const getSaleItems = async (req, res) => {
  try {
    const items = await prisma.saleItem.findMany({
      include: { 
        product: true, // product details
        sale: true     // sale details
      }
    });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch sale items' });
  }
};

// ✅ Get single sale item by ID
export const getSaleItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await prisma.saleItem.findUnique({
      where: { id: Number(id) },
      include: { product: true, sale: true }
    });
    if (!item) return res.status(404).json({ error: 'Sale item not found' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch sale item' });
  }
};

// ✅ Create sale item
export const createSaleItem = async (req, res) => {
  const { saleId, productId, qty, price, subtotal } = req.body;
  try {
    const item = await prisma.saleItem.create({
      data: {
        saleId: parseInt(saleId),
        productId: parseInt(productId),
        qty: parseInt(qty),
        price: parseFloat(price),
        subtotal: parseFloat(subtotal)
      }
    });
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create sale item' });
  }
};

// ✅ Update sale item
export const updateSaleItem = async (req, res) => {
  const { id } = req.params;
  const { saleId, productId, qty, price, subtotal } = req.body;
  try {
    const item = await prisma.saleItem.update({
      where: { id: Number(id) },
      data: {
        saleId: parseInt(saleId),
        productId: parseInt(productId),
        qty: parseInt(qty),
        price: parseFloat(price),
        subtotal: parseFloat(subtotal)
      }
    });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update sale item' });
  }
};

// ✅ Delete sale item
export const deleteSaleItem = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.saleItem.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Sale item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete sale item' });
  }
};
