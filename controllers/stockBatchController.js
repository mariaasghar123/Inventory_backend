import prisma from '../prisma/client.js';

// Get all stock batches
export const getStockBatches = async (req, res) => {
  try {
    const batches = await prisma.stockBatch.findMany({
      include: { product: true }
    });
    res.json(batches);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stock batches' });
  }
};

// Create stock batch
export const createStockBatch = async (req, res) => {
  const { productId, batch_no, expiry_date, qty } = req.body;
  try {
    const batch = await prisma.stockBatch.create({
      data: {
        productId: parseInt(productId),
        batch_no,
        expiry_date: new Date(expiry_date),
        qty: parseInt(qty)
      }
    });
    res.status(201).json(batch);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create stock batch' });
  }
};
// Get single stock batch by ID
export const getStockBatchById = async (req, res) => {
  const { id } = req.params;
  try {
    const stockBatch = await prisma.stockBatch.findUnique({
      where: { id: parseInt(id) },
      include: { product: true } // agar product info bhi chahiye
    });

    if (!stockBatch) {
      return res.status(404).json({ error: "Stock batch not found" });
    }

    res.json(stockBatch);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stock batch" });
  }
};


// Update stock batch
export const updateStockBatch = async (req, res) => {
  const { id } = req.params;
  const { productId, batch_no, expiry_date, qty } = req.body;
  try {
    const updatedBatch = await prisma.stockBatch.update({
      where: { id: parseInt(id) },
      data: {
        productId: parseInt(productId),
        batch_no,
        expiry_date: new Date(expiry_date),
        qty: parseInt(qty)
      }
    });
    res.json(updatedBatch);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update stock batch' });
  }
};

// Delete stock batch
export const deleteStockBatch = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.stockBatch.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Stock batch deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete stock batch' });
  }
};
