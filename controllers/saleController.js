import prisma from '../prisma/client.js';
import { allocateStock } from './allocatestock.js';

// ✅ Get all sales (including the user who created it)
export const getSales = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
          user: true, items: true  // agar aapne relation define kiya hai Prisma schema mein
      }
    });
    res.json(sales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
};

// ✅ Get single sale by ID
export const getSaleById = async (req, res) => {
  const { id } = req.params;
  try {
    const sale = await prisma.sale.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    res.json(sale);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch sale' });
  }
};

// ✅ Create a sale


export const createSale = async (req, res) => {
  const { invoice_no, date, total, discount, paymentMethod, createdBy, items } = req.body;
  // items = [{productId:1, qty:5, price:100}, ...]
  try {
    // 1. Sale create
    const sale = await prisma.sale.create({
      data: {
        invoice_no,
        date: new Date(date),
        total: parseFloat(total),
        discount: parseFloat(discount),
        paymentMethod,
        createdBy: parseInt(createdBy)
      }
    });

    // 2. Sale Items insert + Stock allocate
    for (const item of items) {
      // SaleItem entry
      await prisma.saleItem.create({
        data: {
          saleId: sale.id,
          productId: item.productId,
          qty: item.qty,
          price: item.price,
          subtotal: item.subtotal
        }
      });

      // Stock allocate batch-wise FIFO
      await allocateStock(item.productId, item.qty);
    }

    // 3. Activity add karo
    await prisma.activity.create({
      data: {
        action: `New sale added: Invoice ${invoice_no} - $${total}`,
      }
    });

    res.status(201).json(sale);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to create sale' });
  }
};


// ✅ Update a sale
export const updateSale = async (req, res) => {
  const { id } = req.params;
  const { invoice_no, date, total, discount, paymentMethod, createdBy } = req.body;
  try {
    const sale = await prisma.sale.update({
      where: { id: Number(id) },
      data: {
        invoice_no,
        date: new Date(date),
        total: parseFloat(total),
        discount: parseFloat(discount),
        paymentMethod,
        createdBy: parseInt(createdBy)
      }
    });
    res.json(sale);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update sale' });
  }
};

// ✅ Delete a sale
export const deleteSale = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.sale.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Sale deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete sale' });
  }
};
