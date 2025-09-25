import { Router } from 'express'
import { createClient } from '@supabase/supabase-js'

const router = Router()

// 단건 조회 시점에도 .env 변수 안전하게 읽기
function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )
}

// GET /api/products
router.get('/', async (req, res, next) => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase.from('products').select('*').order('id')
    if (error) throw error
    res.json(data)
  } catch (err) {
    next(err)
  }
})

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single()
    if (error) throw error
    if (!data) return res.status(404).json({ error: '상품을 찾을 수 없습니다' })
    res.json(data)
  } catch (err) {
    next(err)
  }
})

export default router
