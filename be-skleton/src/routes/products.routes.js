import { Router } from 'express'
import { getProducts, getProductById } from '../controllers/products.controller.js'

const router = Router()

// GET /api/products
router.get('/', getProducts)

// GET /api/products/:id
router.get('/:id', getProductById)

export default router
