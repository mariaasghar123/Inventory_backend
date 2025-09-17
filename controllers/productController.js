import prisma from '../prisma/client.js' // jo bhi aapne banaya hai
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890', 12); // 12 digit number
// ✅ Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany()
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' })
  }
}

// ✅ Create product
export const createProduct = async (req, res) => {
  const {
    sku, name, category, unit, barcode,
    purchase_price, sale_price, reorder_level
  } = req.body

  try {
    // agar barcode nahi bheja user ne to hum khud generate karen
    const finalBarcode = barcode && barcode.trim() !== '' ? barcode : nanoid();

    const product = await prisma.product.create({
      data: {
        sku,
        name,
        category,
        unit,
        barcode: finalBarcode,
        purchase_price: parseFloat(purchase_price),
        sale_price: parseFloat(sale_price),
        reorder_level: parseInt(reorder_level)
      }
    })
    // activity add karo
    await prisma.activity.create({
      data: {
        action: `New product added: ${name}`
      }
    });
    res.status(201).json(product)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' })
  }
}


// ✏️ Get single product
export const getProductById = async (req, res) => {
  const { id } = req.params
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    })
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
}
// ✅ Get product by barcode
export const getProductByBarcode = async (req, res) => {
  const { barcode } = req.params;
  try {
    const product = await prisma.product.findFirst({
      where: { barcode: barcode }
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product by barcode' });
  }
};


// ✏️ Update product
export const updateProduct = async (req, res) => {
  const { id } = req.params
  const data = req.body

  try {
    const updated = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        sku: data.sku,
        name: data.name,
        category: data.category,
        unit: data.unit,
        barcode: data.barcode,
        purchase_price: parseFloat(data.purchase_price),
        sale_price: parseFloat(data.sale_price),
        reorder_level: parseInt(data.reorder_level)
      }
    })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' })
  }
}

// ❌ Delete product
export const deleteProduct = async (req, res) => {
  const { id } = req.params
  try {
    await prisma.product.delete({
      where: { id: parseInt(id) }
    })
    res.json({ message: 'Product deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' })
  }
}
