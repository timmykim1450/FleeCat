import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import '../Products/Products.css' // product-grid 스타일 사용
import './Home.css'

// Category icons
import fashionIcon from '../../assets/fashion.png'
import officeSuppliesIcon from '../../assets/office-supplies.png'
import foodIcon from '../../assets/food.png'
import handmadeIcon from '../../assets/handmade.png'
import bookIcon from '../../assets/book.png'
import beautyIcon from '../../assets/beauty.png'
import digitalIcon from '../../assets/digital.png'
import cookwareIcon from '../../assets/cookware.png'

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
      <div>
        <h1>홈</h1>
        {/* 스켈레톤 */}
        <div>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div />
              <div />
              <div />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1>홈</h1>
        <p>{error}</p>
        <button onClick={() => location.reload()}>다시 시도</button>
      </div>
    )
  }

  return (
    <div class="wrap">
      <div className="wrap-category-margin">
        <div className="wrap-category">
          <a className="category-item">
            <img src={fashionIcon} alt="의류" className="category-icon" />
            <span>의류</span>
          </a>
          <a className="category-item">
            <img src={officeSuppliesIcon} alt="사무용품" className="category-icon" />
            <span>사무용품</span>
          </a>
          <a className="category-item">
            <img src={foodIcon} alt="음식" className="category-icon" />
            <span>음식</span>
          </a>
          <a className="category-item">
            <img src={handmadeIcon} alt="핸드메이드" className="category-icon" />
            <span>핸드메이드</span>
          </a>
          <a className="category-item">
            <img src={bookIcon} alt="책" className="category-icon" />
            <span>책</span>
          </a>
          <a className="category-item">
            <img src={beautyIcon} alt="뷰티" className="category-icon" />
            <span>뷰티</span>
          </a>
          <a className="category-item">
            <img src={digitalIcon} alt="전자기기" className="category-icon" />
            <span>전자기기</span>
          </a>
          <a className="category-item">
            <img src={cookwareIcon} alt="주방용품" className="category-icon" />
            <span>주방용품</span>
          </a>
        </div>
      </div>

      {/* 상품 목록 */}
      <div className="product-grid">
        {items.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            variant="button"
            onClick={(product) => navigate(`/products/${product.id}`)}
          />
        ))}
      </div>
    </div>
  )
}
