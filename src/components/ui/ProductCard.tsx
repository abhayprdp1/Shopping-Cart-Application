import { useState } from 'react';
import type { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { StarRating } from './StarRating';
import { formatINR } from '../../utils/currency';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  index?: number;
}

export function ProductCard({ product, onViewDetails, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const cartItem = cartItems.find((i) => i.product.id === product.id);
  const inCart = !!cartItem;
  const maxReached = cartItem?.quantity === 5;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (maxReached) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const originalINR = formatINR(product.price);
  const discountedINR = formatINR(product.price * (1 - product.discountPercentage / 100));
  const hasDiscount = product.discountPercentage > 0;

  return (
    <div
      className="card card-hover anim-fade-up"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: 'pointer',
        animationDelay: `${(index % 8) * 40}ms`,
      }}
      onClick={() => onViewDetails(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container */}
      <div
        style={{
          position: 'relative',
          height: 220,
          background: 'var(--bg-elevated)',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {!imgError ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            onError={() => setImgError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              color: 'var(--text-muted)',
            }}
          >
            <span style={{ fontSize: 42 }}>🛍️</span>
            <span style={{ fontSize: 12 }}>No image</span>
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              background: 'linear-gradient(135deg, #ef4444, #f97316)',
              color: 'white',
              borderRadius: 7,
              padding: '4px 9px',
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.02em',
              boxShadow: '0 3px 10px rgba(239,68,68,0.4)',
            }}
          >
            {Math.round(product.discountPercentage)}% OFF
          </div>
        )}

        {/* In cart indicator */}
        {inCart && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: 'var(--accent)',
              color: 'white',
              borderRadius: 7,
              padding: '4px 9px',
              fontSize: 11,
              fontWeight: 700,
              boxShadow: 'var(--shadow-accent)',
            }}
          >
            In Cart ({cartItem.quantity})
          </div>
        )}

        {/* Hover overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(10,10,20,0.75) 0%, transparent 60%)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '14px',
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.85)',
              letterSpacing: '0.04em',
            }}
          >
            Click to view details →
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: '14px 16px 16px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 9,
        }}
      >
        {/* Category */}
        <span
          className="badge badge-accent"
          style={{ width: 'fit-content', textTransform: 'capitalize' }}
        >
          {product.category.replace(/-/g, ' ')}
        </span>

        {/* Title */}
        <h3
          style={{
            fontSize: 14.5,
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.8em',
          }}
        >
          {product.title}
        </h3>

        {/* Rating */}
        <StarRating rating={product.rating} />

        {/* Divider */}
        <div className="divider" />

        {/* Price + CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <div>
            <div className="price-inr" style={{ fontSize: 18, color: 'var(--text-primary)' }}>
              {discountedINR}
            </div>
            {hasDiscount && (
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  textDecoration: 'line-through',
                  marginTop: 2,
                }}
              >
                {originalINR}
              </div>
            )}
          </div>

          <button
            className="btn btn-primary"
            onClick={handleAdd}
            disabled={maxReached}
            style={{ fontSize: 13, padding: '9px 14px', borderRadius: 10 }}
            title={maxReached ? 'Max 5 items per product' : undefined}
          >
            {added ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span>✓</span> Added
              </span>
            ) : maxReached ? (
              'Max 5'
            ) : inCart ? (
              '+ Add More'
            ) : (
              <>
                <span>🛒</span> Add
              </>
            )}
          </button>
        </div>

        {/* Low stock */}
        {product.stock > 0 && product.stock <= 8 && (
          <div
            className="badge badge-warning"
            style={{ fontSize: 11, fontWeight: 500, textTransform: 'none', letterSpacing: 0, borderRadius: 6, padding: '4px 8px' }}
          >
            ⚡ Only {product.stock} left in stock
          </div>
        )}
      </div>
    </div>
  );
}
