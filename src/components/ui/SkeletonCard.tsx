export function SkeletonCard() {
  return (
    <div
      className="card"
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      {/* Image */}
      <div className="skeleton" style={{ height: 220, borderRadius: 0 }} />

      {/* Body */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {/* Badge */}
        <div className="skeleton" style={{ height: 20, width: '38%', borderRadius: 999 }} />
        {/* Title line 1 */}
        <div className="skeleton" style={{ height: 17, width: '90%' }} />
        {/* Title line 2 */}
        <div className="skeleton" style={{ height: 17, width: '65%' }} />
        {/* Stars */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton" style={{ width: 14, height: 14, borderRadius: 3 }} />
          ))}
          <div className="skeleton" style={{ width: 30, height: 13, marginLeft: 4 }} />
        </div>
        {/* Price row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div className="skeleton" style={{ height: 22, width: 90 }} />
            <div className="skeleton" style={{ height: 14, width: 60 }} />
          </div>
          <div className="skeleton" style={{ height: 40, width: 100, borderRadius: 10 }} />
        </div>
      </div>
    </div>
  );
}
