import type { SortOption } from '../../types';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <select
      id="sort-select"
      className="input"
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      style={{ flex: '0 1 175px', minWidth: 130 }}
    >
      <option value="default">↕ Sort: Default</option>
      <option value="price-asc">↑ Price: Low → High</option>
      <option value="price-desc">↓ Price: High → Low</option>
      <option value="rating-desc">⭐ Top Rated</option>
      <option value="name-asc">🔤 Name A → Z</option>
    </select>
  );
}
