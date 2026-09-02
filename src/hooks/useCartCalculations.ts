import { useMemo } from 'react';
import { useCartStore } from '../store/cartStore';
import type { CartCalculations } from '../types';

const TAX_RATE = 0.05; // 5%
const DISCOUNT_THRESHOLD = 100; // $100
const DISCOUNT_RATE = 0.10; // 10%
export const MINIMUM_CHECKOUT = 10; // $10

export function useCartCalculations(): CartCalculations {
  const items = useCartStore((s) => s.items);

  return useMemo(() => {
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    );
    const discount = subtotal > DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_RATE : 0;
    const taxable = subtotal - discount;
    const tax = taxable * TAX_RATE;
    const total = taxable + tax;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      itemCount,
    };
  }, [items]);
}
