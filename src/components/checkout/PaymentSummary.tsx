import { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useCartCalculations } from '../../hooks/useCartCalculations';
import { formatINR } from '../../utils/currency';
import type { ShippingFormData } from '../../schemas/shippingSchema';

interface PaymentSummaryProps {
  shippingData: ShippingFormData;
  onBack: () => void;
  onSuccess: () => void;
}

export function PaymentSummary({ shippingData, onBack, onSuccess }: PaymentSummaryProps) {
  const items = useCartStore((s) => s.items);
  const { subtotal, tax, discount, total } = useCartCalculations();
  const [placing, setPlacing] = useState(false);

  const handlePlaceOrder = () => {
    setPlacing(true);
    setTimeout(() => onSuccess(), 1800);
  };

  const shippingRows: { label: string; value: string }[] = [
    { label: 'Full Name', value: shippingData.fullName },
    { label: 'Email', value: shippingData.email },
    { label: 'Phone', value: shippingData.phone },
    { label: 'Address', value: shippingData.address },
    { label: 'City', value: shippingData.city },
    { label: 'State', value: shippingData.state },
    { label: 'PIN Code', value: shippingData.zipCode },
    { label: 'Country', value: shippingData.country },
  ];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Shipping details */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-elevated)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 18 }}>📍</span>
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
            Shipping To
          </h3>
        </div>
        <div
          style={{
            padding: '16px 20px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px 24px',
          }}
        >
          {shippingRows.map(({ label, value }) => (
            <div key={label}>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  marginBottom: 3,
                }}
              >
                {label}
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-elevated)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 18 }}>🛍️</span>
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
            Items ({items.length})
          </h3>
        </div>
        <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item) => (
            <div
              key={item.product.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    overflow: 'hidden',
                    background: 'var(--bg-elevated)',
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
                <span
                  style={{
                    fontSize: 13.5,
                    color: 'var(--text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontWeight: 500,
                  }}
                >
                  {item.product.title}
                </span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {item.quantity} × {formatINR(item.product.price)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Price breakdown */}
      <div className="card" style={{ padding: 20 }}>
        <h3
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>💰</span> Price Breakdown
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { label: 'Subtotal', value: formatINR(subtotal), color: 'var(--text-secondary)' },
            ...(discount > 0
              ? [{ label: '🎉 Discount (10%)', value: `−${formatINR(discount)}`, color: 'var(--success)' }]
              : []),
            { label: 'GST (5%)', value: formatINR(tax), color: 'var(--text-secondary)' },
            { label: '🚚 Delivery', value: 'FREE', color: 'var(--success)' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '9px 0',
                fontSize: 14,
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
            <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)' }}>Total Payable</span>
            <span className="price-inr" style={{ fontSize: 26, color: 'var(--accent)' }}>
              {formatINR(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={onBack} disabled={placing} style={{ padding: '12px 22px' }}>
          ← Edit Shipping
        </button>
        <button
          className="btn btn-primary"
          onClick={handlePlaceOrder}
          disabled={placing}
          style={{ padding: '13px 36px', fontSize: 15, flex: 1, maxWidth: 280, borderRadius: 13 }}
        >
          {placing ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
              <span
                style={{
                  width: 18,
                  height: 18,
                  border: '2.5px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              Placing Order...
            </span>
          ) : (
            '✅ Place Order'
          )}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
