/**
 * Pure cart calculation functions — fully testable without React/Zustand.
 * These are the same rules as useCartCalculations.ts:
 *   - Tax    : 5% of subtotal
 *   - Discount: 10% of subtotal when subtotal > $100
 *   - Total  : subtotal + tax - discount
 *   - Min checkout: $10
 */

export const TAX_RATE = 0.05;           // 5%
export const DISCOUNT_THRESHOLD = 100;  // $100
export const DISCOUNT_RATE = 0.10;      // 10%
export const MINIMUM_CHECKOUT = 10;     // $10

export interface CartCalculationInput {
  price: number;
  quantity: number;
}

export interface CartCalculationResult {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  itemCount: number;
  canCheckout: boolean;
}

/**
 * Calculate cart totals from an array of { price, quantity } items.
 */
export function calculateCartTotals(
  items: CartCalculationInput[]
): CartCalculationResult {
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = parseFloat(
    items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)
  );

  // Tax is 5% of the subtotal (per assignment spec)
  const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));

  // 10% discount applied when subtotal > $100
  const discount = parseFloat(
    (subtotal > DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_RATE : 0).toFixed(2)
  );

  // Final total
  const total = parseFloat((subtotal + tax - discount).toFixed(2));

  return {
    subtotal,
    tax,
    discount,
    total,
    itemCount,
    canCheckout: total >= MINIMUM_CHECKOUT,
  };
}
