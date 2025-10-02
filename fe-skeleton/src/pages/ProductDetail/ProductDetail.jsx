// src/pages/ProductDetail.jsx
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { toastErr, toastCartAdded } from '../../lib/toast'
import { addToLocalCart, getCart } from '../../utils/cart'

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
    <div>
      <button onClick={() => navigate(-1)}>← 뒤로</button>
      <p>{error}</p>
      <button onClick={() => location.reload()}>다시 시도</button>
    </div>
  )
  if (!item) return <div>상품이 없습니다.</div>

  return (
    <div>
      <nav>
        <button onClick={() => navigate(-1)}>← 뒤로</button>
      </nav>

      <div>
        {/* 이미지 */}
        <div>
          <div>
            <img
              src={item.image_url}
              alt={item.name}
              loading="lazy"
            />
          </div>
        </div>

        {/* 정보 */}
        <div>
          <h1>{item.name}</h1>
          <p>{item.description}</p>

          <div>
            <span>가격</span>
            <strong>{priceText}</strong>
          </div>

          <div>
            <span>수량</span>
            <div>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="decrease">−</button>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              />
              <button onClick={() => setQty(q => q + 1)} aria-label="increase">+</button>
            </div>
          </div>

          <div>
            <span>합계</span>
            <strong>{totalText}</strong>
          </div>

          <div>
            <button
              onClick={handleAddToCart}
              disabled={posting}
            >
              {posting ? '담는 중…' : '장바구니 담기'}
            </button>
            <button onClick={() => navigate('/cart')}>
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
    <div>
      <div>
        <div>
          <div />
        </div>
        <div>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
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
        const others = (all || []).filter(p => p.product_id !== currentId).slice(0, 4)
        if (alive) setItems(others)
      } catch {
        /* 목록은 조용히 실패해도 됨 */
      }
    })()
    return () => { alive = false }
  }, [currentId])

  if (!items.length) return null

  return (
    <section>
      <h2>다른 상품도 둘러보세요</h2>
      <div>
        {items.map(p => (
          <Link key={p.product_id} to={`/products/${p.product_id}`}>
            <img
              src={p.product_img?.[0]?.product_img_url || '/placeholder.jpg'}
              alt={p.product_name}
            />
            <div>
              <div>
                {p.product_name}
              </div>
              <div>
                {Number(p.product_price).toLocaleString()}원
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

