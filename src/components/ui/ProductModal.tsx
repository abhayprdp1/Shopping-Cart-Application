import { useState } from 'react';
import type { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { StarRating } from './StarRating';
import { formatINR } from '../../utils/currency';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const [selectedImg, setSelectedImg] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const cartItem = cartItems.find((i) => i.product.id === product.id);
  const maxReached = cartItem?.quantity === 5;
  const hasDiscount = product.discountPercentage > 0;

  const handleAdd = () => {
    if (maxReached) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discountedINR = formatINR(product.price * (1 - product.discountPercentage / 100));
  const originalINR = formatINR(product.price);

  return (
    <>
      {/* Backdrop + centering wrapper */}
      <div
        className="anim-fade-in"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.78)',
          backdropFilter: 'blur(8px)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
      {/* Modal — stops click from bubbling to backdrop */}
      <div
        className="anim-fade-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: 'min(820px, 96vw)',
          maxHeight: '92vh',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 24,
          zIndex: 201,
          overflowY: 'auto',
          boxShadow: '0 32px 96px rgba(0,0,0,0.7)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'sticky',
            top: 16,
            float: 'right',
            margin: '16px 16px 0 0',
            zIndex: 10,
            width: 34,
            height: 34,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-light)',
            borderRadius: '50%',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--error-bg)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--error)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-elevated)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
        >
          ✕
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, minHeight: 0 }}>
          {/* Image panel */}
          <div
            style={{
              padding: 24,
              borderRight: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {/* Main image */}
            <div
              style={{
                aspectRatio: '1',
                borderRadius: 16,
                overflow: 'hidden',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
              }}
            >
              <img
                src={product.images[selectedImg] || product.thumbnail}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = product.thumbnail; }}
              />
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.images.slice(0, 6).map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImg(idx)}
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: 10,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: `2px solid ${selectedImg === idx ? 'var(--accent)' : 'var(--border)'}`,
                      transition: 'border-color 0.2s, transform 0.15s',
                      transform: selectedImg === idx ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: selectedImg === idx ? 'var(--shadow-accent)' : 'none',
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = product.thumbnail; }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details panel */}
          <div
            style={{
              padding: '28px 28px 28px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            {/* Category + brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className="badge badge-accent" style={{ textTransform: 'capitalize' }}>
                {product.category.replace(/-/g, ' ')}
              </span>
              {product.brand && (
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  by <strong style={{ color: 'var(--text-secondary)' }}>{product.brand}</strong>
                </span>
              )}
            </div>

            {/* Title */}
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1.3,
              }}
            >
              {product.title}
            </h2>

            {/* Rating */}
            <StarRating rating={product.rating} size={16} />

            {/* Price */}
            <div
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '14px 16px',
              }}
            >
              <div className="price-inr" style={{ fontSize: 30, color: 'var(--text-primary)' }}>
                {discountedINR}
              </div>
              {hasDiscount && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                  <span
                    style={{
                      fontSize: 15,
                      color: 'var(--text-muted)',
                      textDecoration: 'line-through',
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {originalINR}
                  </span>
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #ef4444, #f97316)',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {Math.round(product.discountPercentage)}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: 13.5,
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
              }}
            >
              {product.description}
            </p>

            {/* Stock */}
            <div
              className={`badge ${product.stock > 10 ? 'badge-success' : product.stock > 0 ? 'badge-warning' : ''}`}
              style={{
                width: 'fit-content',
                textTransform: 'none',
                letterSpacing: 0,
                fontSize: 12,
                padding: '5px 12px',
                borderRadius: 8,
                fontWeight: 500,
              }}
            >
              {product.stock > 10
                ? `✅ In Stock (${product.stock} units)`
                : product.stock > 0
                ? `⚡ Only ${product.stock} left!`
                : '❌ Out of Stock'}
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {product.tags.map((tag) => (
                  <span key={tag} className="tag-chip">#{tag}</span>
                ))}
              </div>
            )}

            {/* Cart qty info */}
            {cartItem && (
              <div
                style={{
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  background: 'var(--accent-light)',
                  padding: '8px 12px',
                  borderRadius: 9,
                  border: '1px solid rgba(124,111,255,0.15)',
                }}
              >
                🛒 Already in cart:{' '}
                <strong style={{ color: 'var(--accent)' }}>{cartItem.quantity}/5</strong> items
              </div>
            )}

            <button
              className="btn btn-primary"
              onClick={handleAdd}
              disabled={maxReached || product.stock === 0}
              style={{ marginTop: 'auto', padding: '14px 24px', fontSize: 15, borderRadius: 13 }}
            >
              {added ? '✓ Added to Cart!' : maxReached ? 'Max Quantity (5)' : product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
