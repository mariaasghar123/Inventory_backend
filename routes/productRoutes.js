import express from 'express'
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductByBarcode
} from '../controllers/productController.js'

const router = express.Router()

// All CRUD endpoints
router.get('/', getProducts)
router.post('/', createProduct)
router.get('/barcode/:barcode', getProductByBarcode)

router.get('/:id', getProductById)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router
