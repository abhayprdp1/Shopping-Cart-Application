import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartCalculations } from '../../hooks/useCartCalculations';
import { useThemeStore } from '../../store/themeStore';
import { CartDrawer } from './CartDrawer';

export function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCartCalculations();
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isCheckout = location.pathname === '/checkout';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <nav
        className={scrolled ? 'glass' : ''}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: 66,
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? undefined : 'var(--bg-secondary)',
          borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.06)' : 'var(--border)'}`,
          transition: 'background 0.3s, border-color 0.3s',
        }}
      >
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 19,
              boxShadow: 'var(--shadow-accent)',
              flexShrink: 0,
            }}
          >
            🛍
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
              className="gradient-text"
            >
              ShopCart
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1, letterSpacing: '0.08em', fontWeight: 500 }}>
              INDIA'S FAVOURITE STORE
            </div>
          </div>
        </div>

        {/* Center — breadcrumb on checkout */}
        {isCheckout && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
            <span
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer', color: 'var(--accent)', fontWeight: 500 }}
            >
              Shop
            </span>
            <span>›</span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Checkout</span>
          </div>
        )}

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isCheckout && (
            <button className="btn btn-ghost" onClick={() => navigate('/')} style={{ fontSize: 13 }}>
              ← Back to Shop
            </button>
          )}

          {/* Theme */}
          <button
            id="theme-toggle"
            onClick={toggleTheme}
            title={isDark ? 'Light mode' : 'Dark mode'}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              border: '1.5px solid var(--border-light)',
              background: 'var(--bg-elevated)',
              cursor: 'pointer',
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-light)'; }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Cart */}
          {!isCheckout && (
            <button
              id="cart-button"
              onClick={() => setCartOpen(true)}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 18px',
                borderRadius: 11,
                background: itemCount > 0 ? 'var(--accent-gradient)' : 'var(--bg-elevated)',
                border: itemCount > 0 ? 'none' : '1.5px solid var(--border-light)',
                color: itemCount > 0 ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                transition: 'all 0.25s ease',
                boxShadow: itemCount > 0 ? 'var(--shadow-accent)' : 'none',
              }}
            >
              <span style={{ fontSize: 16 }}>🛒</span>
              <span>Cart</span>
              {itemCount > 0 && (
                <span
                  style={{
                    background: 'rgba(255,255,255,0.25)',
                    borderRadius: 999,
                    padding: '1px 7px',
                    fontSize: 12,
                    fontWeight: 800,
                    minWidth: 22,
                    textAlign: 'center',
                  }}
                >
                  {itemCount}
                </span>
              )}
            </button>
          )}
        </div>
      </nav>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
