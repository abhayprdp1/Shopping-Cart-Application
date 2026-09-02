import { useCartStore } from '../../store/cartStore';
import { useCartCalculations, MINIMUM_CHECKOUT } from '../../hooks/useCartCalculations';
import { formatINR } from '../../utils/currency';

interface CartReviewProps {
  onNext: () => void;
}

export function CartReview({ onNext }: CartReviewProps) {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const { subtotal, tax, discount, total } = useCartCalculations();

  const canCheckout = total >= MINIMUM_CHECKOUT;
  const toDiscount = MINIMUM_CHECKOUT * 10 - subtotal;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
      {/* Items table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
            Order Items
          </h3>
          <span className="badge badge-accent">{items.length} items</span>
        </div>

        <div>
          {items.map((item, idx) => (
            <div
              key={item.product.id}
              style={{
                display: 'flex',
                gap: 16,
                padding: '16px 20px',
                borderBottom: idx < items.length - 1 ? '1px solid var(--border)' : 'none',
                alignItems: 'center',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-elevated)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
            >
              {/* Image */}
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 12,
                  overflow: 'hidden',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  flexShrink: 0,
                }}
              >
                <img
                  src={item.product.thumbnail}
                  alt={item.product.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.product.title}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    textTransform: 'capitalize',
                    marginBottom: 8,
                  }}
                >
                  {item.product.category.replace(/-/g, ' ')}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {formatINR(item.product.price)} each
                </p>
              </div>

              {/* Qty + price */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <p className="price-inr-sm" style={{ fontSize: 16, color: 'var(--text-primary)', fontWeight: 700 }}>
                  {formatINR(item.product.price * item.quantity)}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button
                    className="qty-btn"
                    onClick={() =>
                      item.quantity === 1
                        ? removeItem(item.product.id)
                        : updateQuantity(item.product.id, item.quantity - 1)
                    }
                    style={{ width: 28, height: 28, fontSize: 13 }}
                  >
                    {item.quantity === 1 ? '🗑' : '−'}
                  </button>
                  <span style={{ width: 24, textAlign: 'center', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.quantity}
                  </span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= 5}
                    style={{ width: 28, height: 28, fontSize: 13 }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order summary */}
      <div
        className="card"
        style={{ padding: 20, position: 'sticky', top: 80 }}
      >
        <h3
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 16,
          }}
        >
          Order Summary
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { label: 'Subtotal', value: formatINR(subtotal), color: 'var(--text-secondary)' },
            ...(discount > 0
              ? [{ label: '🎉 Loyalty Discount (10%)', value: `−${formatINR(discount)}`, color: 'var(--success)' }]
              : []),
            { label: 'GST (5%)', value: formatINR(tax), color: 'var(--text-secondary)' },
            { label: 'Delivery', value: 'FREE', color: 'var(--success)' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                fontSize: 13.5,
                color,
                borderBottom: '1px dashed var(--border)',
              }}
            >
              <span>{label}</span>
              <span style={{ fontWeight: 600 }}>{value}</span>
            </div>
          ))}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 0 0',
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Total</span>
            <span className="price-inr" style={{ fontSize: 22, color: 'var(--accent)' }}>
              {formatINR(total)}
            </span>
          </div>
        </div>

        {/* Discount hint */}
        {discount === 0 && toDiscount > 0 && (
          <div
            style={{
              marginTop: 14,
              padding: '10px 12px',
              background: 'var(--success-bg)',
              border: '1px solid rgba(52,211,153,0.15)',
              borderRadius: 10,
              fontSize: 12,
              color: 'var(--success)',
              fontWeight: 500,
            }}
          >
            💡 Add products worth {formatINR(toDiscount)} more to unlock 10% discount!
          </div>
        )}

        {!canCheckout && (
          <div
            style={{
              marginTop: 12,
              padding: '9px 12px',
              background: 'var(--warning-bg)',
              border: '1px solid rgba(251,191,36,0.15)',
              borderRadius: 10,
              fontSize: 12,
              color: 'var(--warning)',
              textAlign: 'center',
              fontWeight: 500,
            }}
          >
            ⚠️ Minimum order: {formatINR(MINIMUM_CHECKOUT)}
          </div>
        )}

        <button
          className="btn btn-primary"
          style={{ width: '100%', marginTop: 16, padding: '13px', fontSize: 14.5, borderRadius: 12 }}
          onClick={onNext}
          disabled={!canCheckout}
        >
          Continue to Shipping →
        </button>
      </div>
    </div>
  );
}
