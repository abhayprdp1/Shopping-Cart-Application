interface StarRatingProps {
  rating: number;
  size?: number;
  showCount?: boolean;
}

export function StarRating({ rating, size = 13, showCount = true }: StarRatingProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const partial = !filled && rating > star - 1;
        const pct = partial ? Math.round((rating - (star - 1)) * 100) : 0;
        const gId = `sg-${star}-${Math.random().toString(36).slice(2, 5)}`;

        return (
          <svg key={star} width={size} height={size} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            {partial && (
              <defs>
                <linearGradient id={gId} x1="0" x2="1" y1="0" y2="0">
                  <stop offset={`${pct}%`} stopColor="#f59e0b" />
                  <stop offset={`${pct}%`} stopColor="var(--border-light)" />
                </linearGradient>
              </defs>
            )}
            <polygon
              points="10,1.5 12.6,7 18.5,7.6 14,11.8 15.5,17.8 10,14.5 4.5,17.8 6,11.8 1.5,7.6 7.4,7"
              fill={filled ? '#f59e0b' : partial ? `url(#${gId})` : 'var(--border-light)'}
            />
          </svg>
        );
      })}
      {showCount && (
        <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 3, fontWeight: 500 }}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
