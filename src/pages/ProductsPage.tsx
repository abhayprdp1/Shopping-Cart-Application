import { useState, useRef, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useFilters } from '../hooks/useFilters';
import { ProductCard } from '../components/ui/ProductCard';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { ProductModal } from '../components/ui/ProductModal';
import { SearchBar } from '../components/filters/SearchBar';
import { formatINR } from '../utils/currency';
import type { Product, SortOption } from '../types';

/* ─── Dropdown hook ─── */
function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return { open, setOpen, ref };
}

/* ─── Filter button ─── */
function FilterBtn({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '9px 14px',
        borderRadius: 10,
        border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border-light)'}`,
        background: active ? 'var(--accent-light)' : 'var(--bg-elevated)',
        color: active ? 'var(--accent-2)' : 'var(--text-secondary)',
        fontSize: 13.5,
        fontWeight: 600,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.18s ease',
      }}
    >
      {children}
      <span style={{ fontSize: 11, color: active ? 'var(--accent-2)' : 'var(--text-muted)', marginLeft: 2 }}>
        {label}
      </span>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" style={{ opacity: 0.5, marginLeft: 2 }}>
        <path d="M5 7L1 3h8z" />
      </svg>
    </button>
  );
}

/* ─── Dropdown panel ─── */
function DropPanel({ children, minWidth = 200 }: { children: React.ReactNode; minWidth?: number }) {
  return (
    <div
      className="anim-fade-up"
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        left: 0,
        minWidth,
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: 14,
        boxShadow: 'var(--shadow-lg)',
        padding: 16,
        zIndex: 40,
      }}
    >
      {children}
    </div>
  );
}

const SORT_OPTIONS: { value: SortOption; label: string; icon: string }[] = [
  { value: 'default', label: 'Default', icon: '↕' },
  { value: 'price-asc', label: 'Price: Low → High', icon: '↑' },
  { value: 'price-desc', label: 'Price: High → Low', icon: '↓' },
  { value: 'rating-desc', label: 'Top Rated', icon: '⭐' },
  { value: 'name-asc', label: 'Name A → Z', icon: '🔤' },
];

export function ProductsPage() {
  const { data: products, isLoading, isError, refetch } = useProducts();
  const {
    filters,
    filteredProducts,
    categories,
    maxProductPrice,
    setSearch,
    setCategory,
    setPriceRange,
    setSortBy,
    clearFilters,
    hasActiveFilters,
  } = useFilters(products);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categoryDrop = useDropdown();
  const priceDrop = useDropdown();
  const sortDrop = useDropdown();

  // Local price state for slider
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(maxProductPrice);

  useEffect(() => {
    setPriceMax(maxProductPrice);
  }, [maxProductPrice]);

  const isCategoryActive = filters.category !== '';
  const isSortActive = filters.sortBy !== 'default';
  const isPriceActive = filters.minPrice > 0 || filters.maxPrice < maxProductPrice;

  const activeCount = [isCategoryActive, isSortActive, isPriceActive, filters.search !== ''].filter(Boolean).length;
  const sortLabel = SORT_OPTIONS.find((o) => o.value === filters.sortBy)?.label ?? 'Default';

  return (
    <>
      {/* ─── Compact Hero ─── */}
      <section
        style={{
          background: 'var(--hero-gradient)',
          padding: '40px 32px 36px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glow */}
        <div style={{ position: 'absolute', top: -60, left: '20%', width: 320, height: 320, background: 'radial-gradient(circle, rgba(124,111,255,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, right: '15%', width: 240, height: 240, background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1
            className="gradient-text"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(28px, 4vw, 46px)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: 10,
            }}
          >
            Discover Amazing Products
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {products
              ? <>{products.length} curated products · Prices in <strong style={{ color: 'var(--accent-2)' }}>USD $</strong></>
              : 'Shop curated products at great prices'}
          </p>
        </div>
      </section>

      {/* ─── Content ─── */}
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '20px 24px 80px' }}>

        {/* ─── Filter toolbar ─── */}
        <div
          className="card"
          style={{
            padding: '12px 14px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
            position: 'sticky',
            top: 66,
            zIndex: 20,
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {/* Search */}
          <SearchBar value={filters.search} onChange={setSearch} />

          {/* Divider */}
          <div style={{ width: 1, height: 28, background: 'var(--border)', flexShrink: 0 }} />

          {/* Category dropdown */}
          <div style={{ position: 'relative' }} ref={categoryDrop.ref}>
            <FilterBtn
              label={isCategoryActive ? filters.category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Category'}
              active={isCategoryActive}
              onClick={() => {
                categoryDrop.setOpen((v) => !v);
                priceDrop.setOpen(false);
                sortDrop.setOpen(false);
              }}
            >
              🏷
            </FilterBtn>
            {categoryDrop.open && (
              <DropPanel minWidth={220}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Select Category</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 260, overflowY: 'auto' }}>
                  {['', ...categories].map((cat) => (
                    <button
                      key={cat || '__all'}
                      onClick={() => {
                        setCategory(cat);
                        categoryDrop.setOpen(false);
                      }}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: 'none',
                        textAlign: 'left',
                        background: filters.category === cat ? 'var(--accent-light)' : 'transparent',
                        color: filters.category === cat ? 'var(--accent-2)' : 'var(--text-secondary)',
                        fontWeight: filters.category === cat ? 700 : 400,
                        fontSize: 13.5,
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        fontFamily: 'inherit',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { if (filters.category !== cat) (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-elevated)'; }}
                      onMouseLeave={(e) => { if (filters.category !== cat) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                    >
                      {cat === '' ? 'All Categories' : cat.replace(/-/g, ' ')}
                      {filters.category === cat && <span style={{ float: 'right' }}>✓</span>}
                    </button>
                  ))}
                </div>
              </DropPanel>
            )}
          </div>

          {/* Price dropdown */}
          <div style={{ position: 'relative' }} ref={priceDrop.ref}>
            <FilterBtn
              label={isPriceActive
                ? `${formatINR(filters.minPrice)} – ${formatINR(filters.maxPrice)}`
                : 'Price'}
              active={isPriceActive}
              onClick={() => {
                priceDrop.setOpen((v) => !v);
                categoryDrop.setOpen(false);
                sortDrop.setOpen(false);
              }}
            >
              ₹
            </FilterBtn>
            {priceDrop.open && (
              <DropPanel minWidth={280}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Price Range (USD)</p>
                {/* Min / Max display */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
                  <div style={{ background: 'var(--bg-elevated)', padding: '5px 10px', borderRadius: 7, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {formatINR(priceMin)}
                  </div>
                  <div style={{ background: 'var(--bg-elevated)', padding: '5px 10px', borderRadius: 7, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {priceMax >= maxProductPrice ? `${formatINR(priceMax)}+` : formatINR(priceMax)}
                  </div>
                </div>
                {/* Sliders */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>MIN PRICE</label>
                    <input
                      type="range"
                      min={0}
                      max={maxProductPrice}
                      value={priceMin}
                      onChange={(e) => {
                        const v = Math.min(Number(e.target.value), priceMax - 1);
                        setPriceMin(v);
                        setPriceRange(v, priceMax);
                      }}
                      style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>MAX PRICE</label>
                    <input
                      type="range"
                      min={0}
                      max={maxProductPrice}
                      value={priceMax}
                      onChange={(e) => {
                        const v = Math.max(Number(e.target.value), priceMin + 1);
                        setPriceMax(v);
                        setPriceRange(priceMin, v);
                      }}
                      style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
                    />
                  </div>
                </div>
                {isPriceActive && (
                  <button
                    onClick={() => {
                      setPriceMin(0);
                      setPriceMax(maxProductPrice);
                      setPriceRange(0, maxProductPrice);
                    }}
                    style={{ marginTop: 12, width: '100%', padding: '7px', background: 'var(--error-bg)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: 8, color: 'var(--error)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Reset Price
                  </button>
                )}
              </DropPanel>
            )}
          </div>

          {/* Sort dropdown */}
          <div style={{ position: 'relative' }} ref={sortDrop.ref}>
            <FilterBtn
              label={isSortActive ? sortLabel : 'Sort'}
              active={isSortActive}
              onClick={() => {
                sortDrop.setOpen((v) => !v);
                categoryDrop.setOpen(false);
                priceDrop.setOpen(false);
              }}
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M1 3h12M3 7h8M5 11h4" />
              </svg>
            </FilterBtn>
            {sortDrop.open && (
              <DropPanel minWidth={210}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Sort By</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        sortDrop.setOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '9px 12px',
                        borderRadius: 9,
                        border: 'none',
                        textAlign: 'left',
                        background: filters.sortBy === opt.value ? 'var(--accent-light)' : 'transparent',
                        color: filters.sortBy === opt.value ? 'var(--accent-2)' : 'var(--text-secondary)',
                        fontWeight: filters.sortBy === opt.value ? 700 : 400,
                        fontSize: 13.5,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { if (filters.sortBy !== opt.value) (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-elevated)'; }}
                      onMouseLeave={(e) => { if (filters.sortBy !== opt.value) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                    >
                      <span style={{ width: 20, textAlign: 'center', fontSize: 14 }}>{opt.icon}</span>
                      <span>{opt.label}</span>
                      {filters.sortBy === opt.value && <span style={{ marginLeft: 'auto', color: 'var(--accent)' }}>✓</span>}
                    </button>
                  ))}
                </div>
              </DropPanel>
            )}
          </div>

          {/* Active filters count + clear */}
          {hasActiveFilters && (
            <>
              <div style={{ width: 1, height: 28, background: 'var(--border)', flexShrink: 0 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    background: 'var(--accent)',
                    color: 'white',
                    borderRadius: 999,
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {activeCount}
                </span>
                <button
                  className="btn btn-ghost"
                  onClick={clearFilters}
                  style={{ color: 'var(--error)', fontSize: 12.5, fontWeight: 600, padding: '6px 10px', border: '1px solid var(--error-bg)', borderRadius: 8 }}
                >
                  Clear All
                </button>
              </div>
            </>
          )}
        </div>

        {/* Results count */}
        {!isLoading && !isError && (
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
            <strong style={{ color: 'var(--text-primary)' }}>{filteredProducts.length}</strong>{' '}
            {filteredProducts.length === 1 ? 'product' : 'products'}
            {hasActiveFilters && <span style={{ color: 'var(--accent-2)', marginLeft: 5 }}>· filtered</span>}
          </div>
        )}

        {/* ─── Loading ─── */}
        {isLoading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18 }}>
            {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ─── Error ─── */}
        {isError && (
          <div
            className="anim-fade-up"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 24px', gap: 18, textAlign: 'center' }}
          >
            <div style={{ width: 72, height: 72, background: 'var(--error-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>⚠️</div>
            <div>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Failed to load products</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Check your internet connection and try again.</p>
            </div>
            <button className="btn btn-primary" onClick={() => refetch()}>🔄 Retry</button>
          </div>
        )}

        {/* ─── Empty ─── */}
        {!isLoading && !isError && filteredProducts.length === 0 && (
          <div
            className="anim-fade-up"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 24px', gap: 18, textAlign: 'center' }}
          >
            <div className="anim-float" style={{ fontSize: 56 }}>🔍</div>
            <div>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>No products found</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Try adjusting your search or filters.</p>
            </div>
            <button className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button>
          </div>
        )}

        {/* ─── Grid ─── */}
        {!isLoading && !isError && filteredProducts.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18 }}>
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} onViewDetails={setSelectedProduct} index={idx} />
            ))}
          </div>
        )}
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  );
}
