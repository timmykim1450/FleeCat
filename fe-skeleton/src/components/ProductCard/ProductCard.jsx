import { Link } from 'react-router-dom'
import './ProductCard.css'

export default function ProductCard({ product, variant = 'link', onClick }) {
  const baseClass = 'product-card'
  const variantClass = `${baseClass}--${variant}`

  if (variant === 'button') {
    return (
      <button
        className={`${baseClass} ${variantClass}`}
        onClick={() => onClick?.(product)}
      >
        <img
          src={product.image_url}
          alt={product.name}
          className="product-card__image"
        />
        <div className="product-card__content">
          <h3 className="product-card__title">{product.name}</h3>
          {product.description && (
            <p className="product-card__description">{product.description}</p>
          )}
          <div className="product-card__price">
            {Number(product.price).toLocaleString()}원
          </div>
        </div>
      </button>
    )
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className={`${baseClass} ${variantClass}`}
    >
      <img
        src={product.image_url}
        alt={product.name}
        className="product-card__image"
      />
      <div className="product-card__content">
        <h3 className="product-card__title">{product.name}</h3>
        {product.description && (
          <p className="product-card__description">{product.description}</p>
        )}
        <div className="product-card__price">
          {Number(product.price).toLocaleString()}원
        </div>
      </div>
    </Link>
  )
}