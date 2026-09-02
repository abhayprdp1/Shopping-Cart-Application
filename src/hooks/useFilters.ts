import { useState, useMemo } from 'react';
import type { Product, FilterState, SortOption } from '../types';

const DEFAULT_FILTERS: FilterState = {
  search: '',
  category: '',
  minPrice: 0,
  maxPrice: 10000,
  sortBy: 'default',
};

export function useFilters(products: Product[] | undefined) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Derive unique categories from products
  const categories = useMemo(() => {
    if (!products) return [];
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return cats.sort();
  }, [products]);

  // Max price from products
  const maxProductPrice = useMemo(() => {
    if (!products || products.length === 0) return 10000;
    return Math.ceil(Math.max(...products.map((p) => p.price)));
  }, [products]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let result = products.filter((p) => {
      const matchesSearch =
        filters.search === '' ||
        p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory =
        filters.category === '' || p.category === filters.category;

      const matchesPrice =
        p.price >= filters.minPrice && p.price <= filters.maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sorting
    switch (filters.sortBy) {
      case 'price-asc':
        result = result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result = result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        result = result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return result;
  }, [products, filters]);

  const setSearch = (search: string) => setFilters((f) => ({ ...f, search }));
  const setCategory = (category: string) =>
    setFilters((f) => ({ ...f, category }));
  const setPriceRange = (minPrice: number, maxPrice: number) =>
    setFilters((f) => ({ ...f, minPrice, maxPrice }));
  const setSortBy = (sortBy: SortOption) =>
    setFilters((f) => ({ ...f, sortBy }));
  const clearFilters = () =>
    setFilters({ ...DEFAULT_FILTERS, maxPrice: maxProductPrice });

  const hasActiveFilters =
    filters.search !== '' ||
    filters.category !== '' ||
    filters.minPrice !== 0 ||
    filters.maxPrice < maxProductPrice ||
    filters.sortBy !== 'default';

  return {
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
  };
}
