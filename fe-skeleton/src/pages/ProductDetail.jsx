// src/pages/ProductDetail.jsx
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { toastErr, toastCartAdded } from '../lib/toast'
import { addToLocalCart, getCart } from '../utils/cart'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [qty, setQty] = useState(1)
  const [posting, setPosting] = useState(false)

  // 상품 불러오기
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setLoading(true)
        const data = await api.get(`/api/products/${id}`) // 에러 시 api가 토스트 처리
        if (alive) setItem(data)
      } catch (err) {
        if (alive) setError(err?.message || '문제가 발생했습니다')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [id])

  const priceText = useMemo(
    () => (item ? Number(item.price).toLocaleString() + '원' : ''),
    [item]
  )

  const totalText = useMemo(
    () => (item ? (Number(item.price) * qty).toLocaleString() + '원' : ''),
    [item, qty]
  )

  // ✅ 로컬 장바구니에만 담기 (서버 호출 없음)
  const handleAddToCart = () => {
    try {
      setPosting(true)
      if (!item) throw new Error('상품 정보가 없습니다.')

      // 되돌리기용 스냅샷
      const snapshot = getCart()

      addToLocalCart(
        {
          id: Number(id),
          name: item.name,
          price: Number(item.price),
          image_url: item.image_url,
        },
        qty
      )

      // 커스텀 토스트: 되돌리기 + 장바구니 보기
      toastCartAdded({
        product: item,
        qty,
        onUndo: () => localStorage.setItem('cart', JSON.stringify(snapshot)),
        onGoCart: () => navigate('/cart'),
      })
    } catch (err) {
      toastErr(err?.message || String(err))
    } finally {
      setPosting(false)
    }
  }

  if (loading) return <Skeleton />
  if (error) return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate(-1)} style={btnGhost}>← 뒤로</button>
      <p style={{ color: 'crimson', marginTop: 12 }}>{error}</p>
      <button onClick={() => location.reload()} style={{ ...btn, marginTop: 12 }}>다시 시도</button>
    </div>
  )
  if (!item) return <div style={{ padding: 20 }}>상품이 없습니다.</div>

  return (
    <div style={{ padding: 20 }}>
      <nav style={{ marginBottom: 12 }}>
        <button onClick={() => navigate(-1)} style={btnGhost}>← 뒤로</button>
      </nav>

      <div style={wrap}>
        {/* 이미지 */}
        <div style={left}>
          <div style={imgBox}>
            <img
              src={item.image_url}
              alt={item.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
              loading="lazy"
            />
          </div>
        </div>

        {/* 정보 */}
        <div style={right}>
          <h1 style={{ margin: 0, fontSize: 24 }}>{item.name}</h1>
          <p style={{ color: '#666', margin: '8px 0 16px' }}>{item.description}</p>

          <div style={priceRow}>
            <span style={{ color: '#777' }}>가격</span>
            <strong style={{ fontSize: 20 }}>{priceText}</strong>
          </div>

          <div style={qtyRow}>
            <span style={{ color: '#777' }}>수량</span>
            <div style={qtyBox}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={qtyBtn} aria-label="decrease">−</button>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                style={qtyInput}
              />
              <button onClick={() => setQty(q => q + 1)} style={qtyBtn} aria-label="increase">+</button>
            </div>
          </div>

          <div style={totalRow}>
            <span style={{ color: '#777' }}>합계</span>
            <strong style={{ fontSize: 20 }}>{totalText}</strong>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button
              onClick={handleAddToCart}
              disabled={posting}
              style={{ ...btn, opacity: posting ? 0.7 : 1 }}
            >
              {posting ? '담는 중…' : '장바구니 담기'}
            </button>
            <button onClick={() => navigate('/cart')} style={btnGhost}>
              장바구니로 이동
            </button>
          </div>
        </div>
      </div>

      <RelatedProducts currentId={Number(id)} />
    </div>
  )
}

/* ---------------- UI 하위 컴포넌트 ---------------- */

function Skeleton() {
  return (
    <div style={{ padding: 20 }}>
      <div style={wrap}>
        <div style={left}>
          <div style={{ ...imgBox, background: '#f3f3f4' }} />
        </div>
        <div style={right}>
          <div style={skel(24, 60)} />
          <div style={skel(14, 100)} />
          <div style={{ height: 16 }} />
          <div style={skel(18, 30)} />
          <div style={{ height: 8 }} />
          <div style={skel(18, 30)} />
        </div>
      </div>
    </div>
  )
}

function RelatedProducts({ currentId }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const all = await api.get('/api/products') // 실패시 api가 토스트 처리
        const others = (all || []).filter(p => p.id !== currentId).slice(0, 4)
        if (alive) setItems(others)
      } catch {
        /* 목록은 조용히 실패해도 됨 */
      }
    })()
    return () => { alive = false }
  }, [currentId])

  if (!items.length) return null

  return (
    <section style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 18, marginBottom: 12 }}>다른 상품도 둘러보세요</h2>
      <div style={{
        display: 'grid', gap: 12,
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))'
      }}>
        {items.map(p => (
          <Link key={p.id} to={`/products/${p.id}`} style={cardSm}>
            <img
              src={p.image_url}
              alt={p.name}
              style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }}
            />
            <div style={{ padding: '6px 4px 8px' }}>
              <div style={{ fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.name}
              </div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>
                {Number(p.price).toLocaleString()}원
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ---------------- 스타일 객체 ---------------- */

const wrap = {
  display: 'grid',
  gap: 20,
  gridTemplateColumns: '1.2fr 1fr',
}
const left = {}
const right = { display: 'flex', flexDirection: 'column' }
const imgBox = { width: '100%', aspectRatio: '4/3', overflow: 'hidden', borderRadius: 12, background: '#fafafa' }

const priceRow = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }
const qtyRow = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }
const totalRow = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }

const qtyBox = { display: 'flex', alignItems: 'center', gap: 6 }
const qtyBtn = { width: 28, height: 28, borderRadius: 6, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }
const qtyInput = { width: 56, textAlign: 'center', padding: '6px 8px', borderRadius: 6, border: '1px solid #ddd' }

const btn = { padding: '10px 14px', borderRadius: 10, border: '1px solid #1e5eff', background: '#1e5eff', color: '#fff', fontWeight: 700, cursor: 'pointer' }
const btnGhost = { padding: '10px 14px', borderRadius: 10, border: '1px solid #ddd', background: '#fff', color: '#222', cursor: 'pointer' }
const cardSm = { border: '1px solid #eee', borderRadius: 10, overflow: 'hidden', background: '#fff', textDecoration: 'none', color: 'inherit' }

const skel = (h = 16, wPct = 100) => ({
  height: h, width: `${wPct}%`, background: '#f2f3f5', borderRadius: 6, margin: '8px 0'
})
