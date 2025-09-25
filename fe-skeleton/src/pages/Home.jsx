import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch('/api/products') // vite 프록시로 BE(8000) 전달
        if (!res.ok) throw new Error('상품을 불러오지 못했습니다')
        const data = await res.json()
        if (alive) setItems(data)
      } catch (err) {
        setError(err.message || '문제가 발생했습니다')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <h1>홈</h1>
        {/* 스켈레톤 */}
        <div style={{
          display: 'grid', gap: 16,
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'
        }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{
              border: '1px solid #eee', borderRadius: 8, padding: 12, background: '#fff'
            }}>
              <div style={{ width: '100%', height: 150, background: '#f2f2f2', borderRadius: 4 }} />
              <div style={{ height: 16, background: '#f5f5f5', marginTop: 12, borderRadius: 4 }} />
              <div style={{ height: 16, background: '#f5f5f5', marginTop: 8, width: '40%', borderRadius: 4 }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <h1>홈</h1>
        <p style={{ color: 'crimson' }}>{error}</p>
        <button onClick={() => location.reload()}>다시 시도</button>
      </div>
    )
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>홈</h1>
      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        }}
      >
        {items.map(p => (
          <button
            key={p.id}
            onClick={() => navigate(`/products/${p.id}`)}
            style={{
              border: '1px solid #ddd',
              borderRadius: 12,
              padding: 12,
              background: '#fff',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            <img
              src={p.image_url}
              alt={p.name}
              style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 8 }}
              loading="lazy"
            />
            <h3 style={{ margin: '12px 0 4px', fontSize: 16 }}>{p.name}</h3>
            <b style={{ fontSize: 15 }}>{Number(p.price).toLocaleString()}원</b>
          </button>
        ))}
      </div>
    </div>
  )
}
