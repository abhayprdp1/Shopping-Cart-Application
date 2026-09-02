import { useCartStore } from '../../store/cartStore';
import { useCartCalculations, MINIMUM_CHECKOUT } from '../../hooks/useCartCalculations';
import { useNavigate } from 'react-router-dom';
import { formatINR } from '../../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const { subtotal, tax, discount, total, itemCount } = useCartCalculations();
  const navigate = useNavigate();

  const canCheckout = total >= MINIMUM_CHECKOUT && items.length > 0;
  const minINR = formatINR(MINIMUM_CHECKOUT);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="anim-fade-in"
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
          }}
        />
      )}

      {/* Drawer */}
      <div
        className={isOpen ? 'anim-slide-right' : ''}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(440px, 96vw)',
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border)',
          zIndex: 101,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? undefined : 'translateX(110%)',
          transition: isOpen ? undefined : 'transform 0.3s ease',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 22px 18px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                background: 'var(--accent-light)',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 17,
              }}
            >
              🛒
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                Your Cart
              </h2>
              {itemCount > 0 && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </p>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {items.length > 0 && (
              <button className="btn btn-danger" onClick={clearCart} style={{ padding: '7px 12px', fontSize: 12 }}>
                Clear All
              </button>
            )}
            <button
              className="btn btn-ghost"
              onClick={onClose}
              style={{
                width: 34,
                height: 34,
                padding: 0,
                borderRadius: 9,
                fontSize: 17,
                border: '1px solid var(--border)',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 22px' }}>
          {items.length === 0 ? (
            <div
              className="anim-fade-up"
              style={{
                height: '100%',
                minHeight: 300,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 14,
                color: 'var(--text-muted)',
              }}
            >
              <div className="anim-float" style={{ fontSize: 64 }}>🛍️</div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Your cart is empty
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  Add products to get started
                </p>
              </div>
              <button className="btn btn-primary" onClick={onClose} style={{ marginTop: 8 }}>
                Browse Products
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="card"
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: '12px',
                    borderRadius: 12,
                  }}
                >
                  {/* Thumb */}
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 9,
                      overflow: 'hidden',
                      background: 'var(--bg-elevated)',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        lineHeight: 1.35,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {item.product.title}
                    </p>
                    <p style={{ fontSize: 11.5, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {item.product.category.replace(/-/g, ' ')}
                    </p>

                    {/* Controls row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 7,
                        marginTop: 4,
                      }}
                    >
                      <button
                        className="qty-btn"
                        style={{ width: 28, height: 28, fontSize: 14 }}
                        onClick={() =>
                          item.quantity === 1
                            ? removeItem(item.product.id)
                            : updateQuantity(item.product.id, item.quantity - 1)
                        }
                      >
                        {item.quantity === 1 ? '🗑' : '−'}
                      </button>
                      <span
                        style={{
                          width: 26,
                          textAlign: 'center',
                          fontSize: 14,
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        className="qty-btn"
                        style={{ width: 28, height: 28, fontSize: 14 }}
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= 5}
                      >
                        +
                      </button>

                      <span
                        style={{
                          marginLeft: 'auto',
                          fontSize: 14,
                          fontWeight: 700,
                          color: 'var(--accent-2)',
                        }}
                        className="price-inr-sm"
                      >
                        {formatINR(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            style={{
              flexShrink: 0,
              borderTop: '1px solid var(--border)',
              background: 'var(--bg-elevated)',
            }}
          >
            {/* Summary */}
            <div style={{ padding: '16px 22px 4px' }}>
              {[
                { label: 'Subtotal', value: formatINR(subtotal), color: 'var(--text-secondary)' },
                ...(discount > 0
                  ? [{ label: '🎉 10% Discount', value: `−${formatINR(discount)}`, color: 'var(--success)' }]
                  : []),
                { label: 'GST (5%)', value: formatINR(tax), color: 'var(--text-secondary)' },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '5px 0',
                    fontSize: 13,
                    color,
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
                  padding: '10px 0 4px',
                  borderTop: '1px dashed var(--border-light)',
                  marginTop: 6,
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Total</span>
                <span className="price-inr" style={{ fontSize: 20, color: 'var(--accent)' }}>
                  {formatINR(total)}
                </span>
              </div>
            </div>

            <div style={{ padding: '12px 22px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {!canCheckout && (
                <div
                  style={{
                    background: 'var(--warning-bg)',
                    border: '1px solid rgba(251,191,36,0.2)',
                    borderRadius: 10,
                    padding: '9px 12px',
                    fontSize: 12,
                    color: 'var(--warning)',
                    textAlign: 'center',
                    fontWeight: 500,
                  }}
                >
                  ⚠️ Minimum order amount is {minINR}
                </div>
              )}
              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: 15, borderRadius: 12 }}
                disabled={!canCheckout}
                onClick={() => {
                  onClose();
                  navigate('/checkout');
                }}
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
