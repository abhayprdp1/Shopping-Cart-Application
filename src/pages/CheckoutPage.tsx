import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { CartReview } from '../components/checkout/CartReview';
import { ShippingForm } from '../components/checkout/ShippingForm';
import { PaymentSummary } from '../components/checkout/PaymentSummary';
import type { CheckoutStep } from '../types';
import type { ShippingFormData } from '../schemas/shippingSchema';

const STEPS: { id: CheckoutStep; label: string; emoji: string; desc: string }[] = [
  { id: 'cart', label: 'Cart Review', emoji: '🛒', desc: 'Review your items' },
  { id: 'shipping', label: 'Shipping', emoji: '📦', desc: 'Delivery details' },
  { id: 'payment', label: 'Payment', emoji: '✅', desc: 'Confirm order' },
];

export function CheckoutPage() {
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId] = useState(() => Math.random().toString(36).slice(2, 10).toUpperCase());
  const clearCart = useCartStore((s) => s.clearCart);
  const navigate = useNavigate();

  const currentIdx = STEPS.findIndex((s) => s.id === step);

  const handleSuccess = () => {
    clearCart();
    setOrderSuccess(true);
  };

  /* ─── Success screen ─── */
  if (orderSuccess) {
    return (
      <div
        className="anim-fade-up"
        style={{
          minHeight: '82vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
          textAlign: 'center',
          gap: 28,
        }}
      >
        {/* Check icon */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              inset: -16,
              background: 'radial-gradient(circle, rgba(52,211,153,0.2) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: 'pulse-ring 2s ease-out infinite',
            }}
          />
          <div
            className="anim-check-pop"
            style={{
              width: 100,
              height: 100,
              background: 'linear-gradient(135deg, var(--success), #22c55e)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 46,
              boxShadow: '0 20px 60px rgba(52,211,153,0.45)',
              color: 'white',
              fontWeight: 900,
              position: 'relative',
              zIndex: 1,
            }}
          >
            ✓
          </div>
        </div>

        {/* Message */}
        <div>
          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(26px, 4vw, 40px)',
              fontWeight: 900,
              color: 'var(--text-primary)',
              marginBottom: 10,
              letterSpacing: '-0.02em',
            }}
          >
            Order Placed! 🎉
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 400 }}>
            Thank you for shopping with <strong style={{ color: 'var(--text-secondary)' }}>ShopCart</strong>! Your order is confirmed and will be delivered soon.
          </p>
        </div>

        {/* Order ID card */}
        <div
          className="card"
          style={{
            padding: '20px 36px',
            border: '1px solid rgba(52,211,153,0.2)',
            boxShadow: '0 4px 24px rgba(52,211,153,0.1)',
          }}
        >
          <div style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
            Order ID
          </div>
          <div
            style={{
              fontFamily: "'Outfit', monospace",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: '0.1em',
              color: 'var(--success)',
            }}
          >
            #{orderId}
          </div>
        </div>

        {/* Steps */}
        <div
          style={{
            display: 'flex',
            gap: 0,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 4,
            overflow: 'hidden',
          }}
        >
          {[
            { label: 'Order Confirmed', icon: '✅' },
            { label: 'Processing', icon: '⚙️' },
            { label: 'Out for Delivery', icon: '🚚' },
            { label: 'Delivered', icon: '📬' },
          ].map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: '8px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                background: i === 0 ? 'var(--success-bg)' : 'transparent',
                borderRadius: 9,
                opacity: i === 0 ? 1 : 0.4,
              }}
            >
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              <span style={{ fontSize: 10.5, fontWeight: 600, color: i === 0 ? 'var(--success)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary"
          style={{ padding: '14px 36px', fontSize: 15, borderRadius: 13 }}
          onClick={() => navigate('/')}
        >
          🛍️ Continue Shopping
        </button>
      </div>
    );
  }

  /* ─── Checkout layout ─── */
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px 100px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 28,
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: 4,
          }}
        >
          Checkout
        </h1>
        <p style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>
          Complete your purchase securely
        </p>
      </div>

      {/* Step progress */}
      <div
        style={{
          display: 'flex',
          marginBottom: 36,
          position: 'relative',
        }}
      >
        {/* Progress line */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: '16.67%',
            right: '16.67%',
            height: 2,
            background: 'var(--border)',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: '16.67%',
            width: `${(currentIdx / (STEPS.length - 1)) * 66.67}%`,
            height: 2,
            background: 'var(--accent-gradient)',
            zIndex: 1,
            transition: 'width 0.4s ease',
          }}
        />

        {STEPS.map((s, idx) => {
          const isActive = s.id === step;
          const isDone = idx < currentIdx;
          return (
            <div
              key={s.id}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                position: 'relative',
                zIndex: 2,
              }}
            >
              {/* Circle */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isDone ? 16 : 18,
                  fontWeight: 800,
                  background: isDone
                    ? 'var(--success)'
                    : isActive
                    ? 'var(--accent-gradient)'
                    : 'var(--bg-elevated)',
                  border: `2px solid ${
                    isDone ? 'var(--success)' : isActive ? 'var(--accent)' : 'var(--border-light)'
                  }`,
                  color: isDone || isActive ? 'white' : 'var(--text-muted)',
                  boxShadow: isActive ? 'var(--shadow-accent)' : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                {isDone ? '✓' : s.emoji}
              </div>

              {/* Label */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: isActive
                      ? 'var(--text-primary)'
                      : isDone
                      ? 'var(--success)'
                      : 'var(--text-muted)',
                    transition: 'color 0.3s',
                  }}
                >
                  {s.label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                  {s.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="anim-fade-up" key={step}>
        {step === 'cart' && <CartReview onNext={() => setStep('shipping')} />}
        {step === 'shipping' && (
          <ShippingForm
            onNext={(data) => {
              setShippingData(data);
              setStep('payment');
            }}
            onBack={() => setStep('cart')}
          />
        )}
        {step === 'payment' && shippingData && (
          <PaymentSummary
            shippingData={shippingData}
            onBack={() => setStep('shipping')}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  );
}
