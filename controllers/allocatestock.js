// utils/allocateStock.js
import prisma from '../prisma/client.js';
export const allocateStock = async (productId, quantity) => {
  let remainingQty = quantity;

  // 1. Available batches laao expiry wise
  const batches = await prisma.stockBatch.findMany({
    where: { productId, qty: { gt: 0 } },
    orderBy: { expiry_date: 'asc' }
  });

  // 2. FIFO minus karo
  for (const batch of batches) {
    if (remainingQty <= 0) break;

    const available = batch.qty;
    const deduct = Math.min(available, remainingQty);

    // qty minus
    await prisma.stockBatch.update({
      where: { id: batch.id },
      data: { qty: available - deduct }
    });

    remainingQty -= deduct;
  }

  if (remainingQty > 0) {
    // matlab stock khatam ho gaya
    throw new Error('Not enough stock in batches!');
  }
};
