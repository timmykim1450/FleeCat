import { supabase } from '../lib/supabase.js'

export const getProducts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('product')
      .select(`
        *,
        product_img (
          product_img_id,
          product_img_url,
          product_image_sequence
        )
      `)
      .order('product_id')

    if (error) {
      console.error('❌ Supabase 에러:', error)
      return res.status(500).json({ error: error.message })
    }

    res.json(data)
  } catch (err) {
    console.error('❌ 서버 에러:', err)
    res.status(500).json({ error: '서버 오류가 발생했습니다', details: err.message })
  }
}

export const getProductById = async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (isNaN(id)) {
      return res.status(400).json({ error: '유효하지 않은 상품 ID입니다' })
    }

    const { data, error } = await supabase
      .from('product')
      .select(`
        *,
        product_img (
          product_img_id,
          product_img_url,
          product_image_sequence
        )
      `)
      .eq('product_id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: '상품을 찾을 수 없습니다' })
      }
      return res.status(500).json({ error: error.message })
    }

    res.json(data)
  } catch (err) {
    res.status(500).json({ error: '서버 오류가 발생했습니다' })
  }
}
