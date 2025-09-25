// src/pages/Products.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { toastErr } from '../lib/toast'

export default function Products() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setLoading(true)
        const list = await api.get('/api/products') // 공통 api 호출
        if (alive) setItems(list || [])
      } catch (err) {
        if (alive) setError(err?.message || '상품을 불러오지 못했습니다')
        toastErr(err)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  if (loading) return <div style={{ padding: 24 }}>상품 불러오는 중…</div>
  if (error) return (
    <div style={{ padding: 24 }}>
      <p style={{ color: 'crimson' }}>{error}</p>
      <button onClick={() => location.reload()}>다시 시도</button>
    </div>
  )
  if (!items.length) return <div style={{ padding: 24 }}>등록된 상품이 없습니다.</div>

  return (
    <div style={{
      display: 'grid',
      gap: 16,
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'
    }}>
      {items.map(p => (
        <Link
          key={p.id}
          to={`/products/${p.id}`}
          style={{
            border: '1px solid #ddd',
            borderRadius: 8,
            overflow: 'hidden',
            textDecoration: 'none',
            color: 'inherit',
            background: '#fff'
          }}
        >
          <img
            src={p.image_url}
            alt={p.name}
            style={{ width: '100%', height: 150, objectFit: 'cover' }}
          />
          <div style={{ padding: 12 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>{p.name}</h3>
            <p style={{ margin: '0 0 12px', color: '#555', fontSize: 14 }}>
              {p.description}
            </p>
            <b style={{ fontSize: 15 }}>{Number(p.price).toLocaleString()}원</b>
          </div>
        </Link>
      ))}
    </div>
  )
}
