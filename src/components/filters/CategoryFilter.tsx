interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onChange: (category: string) => void;
}

export function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  return (
    <select
      id="category-filter"
      className="input"
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      style={{ flex: '0 1 190px', minWidth: 130 }}
    >
      <option value="">All Categories</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
        </option>
      ))}
    </select>
  );
}
