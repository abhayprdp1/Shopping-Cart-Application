interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 0 }}>
      <svg
        style={{
          position: 'absolute',
          left: 13,
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: 'var(--text-muted)',
        }}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        id="search-input"
        type="text"
        className="input"
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ paddingLeft: 38, paddingRight: value ? 36 : 16 }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            fontSize: 14,
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--error)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
