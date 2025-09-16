import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1️⃣ Users
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin123',
      role: 'admin',
      username: 'admin12345',
      password: '1234'
    }
  });

  const cashierUser = await prisma.user.create({
    data: {
      name: 'Cashier123',
      role: 'cashier',
      username: 'cashier12345',
      password: '5678'
    }
  });

  // 2️⃣ Products
  const milk = await prisma.product.create({
    data: {
      sku: 'P001',
      name: 'Milk',
      category: 'Dairy',
      unit: 'ltr',
      barcode: '123456789',
      purchase_price: 50,
      sale_price: 70,
      reorder_level: 10
    }
  });

  const bread = await prisma.product.create({
    data: {
      sku: 'P002',
      name: 'Bread',
      category: 'Bakery',
      unit: 'pcs',
      barcode: '987654321',
      purchase_price: 30,
      sale_price: 50,
      reorder_level: 20
    }
  });

  // 3️⃣ StockBatches
  await prisma.stockBatch.createMany({
    data: [
      {
        productId: milk.id,
        batch_no: 'B001',
        expiry_date: new Date('2025-12-31'),
        qty: 100
      },
      {
        productId: bread.id,
        batch_no: 'B002',
        expiry_date: new Date('2025-10-15'),
        qty: 200
      }
    ]
  });

  // 4️⃣ Sales
  const sale1 = await prisma.sale.create({
    data: {
      invoice_no: 'INV001',
      date: new Date(),
      total: 140,
      discount: 10,
      paymentMethod: 'cash',
      createdBy: adminUser.id
    }
  });

  const sale2 = await prisma.sale.create({
    data: {
      invoice_no: 'INV002',
      date: new Date(),
      total: 50,
      discount: 0,
      paymentMethod: 'card',
      createdBy: cashierUser.id
    }
  });

  // 5️⃣ SaleItems
  await prisma.saleItem.createMany({
    data: [
      {
        saleId: sale1.id,
        productId: milk.id,
        qty: 2,
        price: milk.sale_price,
        subtotal: 2 * milk.sale_price
      },
      {
        saleId: sale1.id,
        productId: bread.id,
        qty: 1,
        price: bread.sale_price,
        subtotal: bread.sale_price
      },
      {
        saleId: sale2.id,
        productId: bread.id,
        qty: 1,
        price: bread.sale_price,
        subtotal: bread.sale_price
      }
    ]
  });
  // ✅ Insert dummy return
  const return1 = await prisma.return.create({
    data: {
      saleId: 3,        // existing sale id
      productId: 1,     // existing product id
      qty: 2,
      reason: "Damaged",
      refundAmount: 500,
    },
  });
  const purchase1 = await prisma.purchase.create({
  data: {
    supplierId: 1,        // you can create a supplier table or use dummy id
    date: new Date(),
    invoiceNo: "PUR-001",
    total: 5000,
  },
});
const purchaseItem1 = await prisma.purchaseItem.create({
  data: {
    purchaseId: 1,        // existing purchase id
    productId: 1,         // existing product id
    qty: 10,
    costPrice: 400,
  },
});
const expense1 = await prisma.expense.create({
  data: {
    category: "Electricity",
    amount: 1200,
    date: new Date(),
    description: "Electricity bill for July",
    reminderDate: new Date("2025-09-30"),
  },
});
  console.log("Return created:", return1);
  console.log("Purchase created:", purchase1);
  console.log("Expense created:", expense1);
  console.log("PurchaseItem created:", purchaseItem1);
  console.log("✅ Database seeded successfully!");

}


main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
