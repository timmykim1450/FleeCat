import { products } from '../data/products.js'

export const getProducts = (req, res) => {
  res.json(products)
}

export const getProductById = (req, res) => {
  const id = Number(req.params.id)
  const item = products.find(p => p.id === id)
  if (!item) return res.status(404).json({ error: '상품을 찾을 수 없습니다' })
  res.json(item)
}
