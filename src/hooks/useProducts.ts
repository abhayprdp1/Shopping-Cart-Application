import { useQuery } from '@tanstack/react-query';
import { ProductsResponseSchema } from '../schemas/productSchema';
import type { Product } from '../types';

const API_BASE = 'https://dummyjson.com';

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products?limit=100`);
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);
  const json = await res.json();
  // Validate with Zod
  const parsed = ProductsResponseSchema.parse(json);
  return parsed.products;
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
