import { useMemo } from 'react';
import { useCartStore } from '../store/cartStore';
import { calculateCartTotals } from '../utils/cartCalculations';
import type { CartCalculations } from '../types';

export { MINIMUM_CHECKOUT } from '../utils/cartCalculations';

export function useCartCalculations(): CartCalculations {
  const items = useCartStore((s) => s.items);

  return useMemo(() => {
    const result = calculateCartTotals(
      items.map((i) => ({ price: i.product.price, quantity: i.quantity }))
    );
    return {
      subtotal: result.subtotal,
      tax: result.tax,
      discount: result.discount,
      total: result.total,
      itemCount: result.itemCount,
    };
  }, [items]);
}
