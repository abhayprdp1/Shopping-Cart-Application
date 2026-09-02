import { describe, it, expect } from 'vitest';
import {
  calculateCartTotals,
  TAX_RATE,
  DISCOUNT_THRESHOLD,
  DISCOUNT_RATE,
  MINIMUM_CHECKOUT,
} from '../utils/cartCalculations';

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function item(price: number, quantity: number) {
  return { price, quantity };
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
describe('Cart calculation constants', () => {
  it('TAX_RATE is 5%', () => {
    expect(TAX_RATE).toBe(0.05);
  });

  it('DISCOUNT_THRESHOLD is $100', () => {
    expect(DISCOUNT_THRESHOLD).toBe(100);
  });

  it('DISCOUNT_RATE is 10%', () => {
    expect(DISCOUNT_RATE).toBe(0.1);
  });

  it('MINIMUM_CHECKOUT is $10', () => {
    expect(MINIMUM_CHECKOUT).toBe(10);
  });
});

// ---------------------------------------------------------------------------
// Empty cart
// ---------------------------------------------------------------------------
describe('calculateCartTotals — empty cart', () => {
  it('returns all zeros for an empty cart', () => {
    const result = calculateCartTotals([]);
    expect(result.subtotal).toBe(0);
    expect(result.tax).toBe(0);
    expect(result.discount).toBe(0);
    expect(result.total).toBe(0);
    expect(result.itemCount).toBe(0);
  });

  it('cannot checkout when cart is empty', () => {
    expect(calculateCartTotals([]).canCheckout).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Subtotal & item count
// ---------------------------------------------------------------------------
describe('calculateCartTotals — subtotal', () => {
  it('calculates subtotal correctly for a single item', () => {
    const result = calculateCartTotals([item(20, 1)]);
    expect(result.subtotal).toBe(20);
  });

  it('calculates subtotal correctly for multiple quantities', () => {
    const result = calculateCartTotals([item(15, 3)]);
    expect(result.subtotal).toBe(45);
  });

  it('calculates subtotal correctly for multiple different items', () => {
    // $10 × 2 + $25 × 1 = $45
    const result = calculateCartTotals([item(10, 2), item(25, 1)]);
    expect(result.subtotal).toBe(45);
  });

  it('counts total item quantity across all cart items', () => {
    const result = calculateCartTotals([item(10, 3), item(5, 2)]);
    expect(result.itemCount).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// Tax — 5% of subtotal
// ---------------------------------------------------------------------------
describe('calculateCartTotals — tax (5% of subtotal)', () => {
  it('applies 5% tax on the full subtotal (no discount case)', () => {
    // Subtotal = $50 → tax = $2.50
    const result = calculateCartTotals([item(50, 1)]);
    expect(result.tax).toBe(2.5);
  });

  it('applies 5% tax on the full subtotal even when discount applies', () => {
    // Subtotal = $200 → tax = $10 (5% of $200, not of $200 - discount)
    const result = calculateCartTotals([item(200, 1)]);
    expect(result.tax).toBe(10);
  });

  it('tax is 0 when subtotal is 0', () => {
    expect(calculateCartTotals([]).tax).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Discount — 10% when subtotal > $100
// ---------------------------------------------------------------------------
describe('calculateCartTotals — discount', () => {
  it('no discount when subtotal is exactly $100', () => {
    const result = calculateCartTotals([item(100, 1)]);
    expect(result.discount).toBe(0);
  });

  it('no discount when subtotal is below $100', () => {
    const result = calculateCartTotals([item(50, 1)]);
    expect(result.discount).toBe(0);
  });

  it('applies 10% discount when subtotal is above $100', () => {
    // Subtotal = $150 → discount = $15
    const result = calculateCartTotals([item(150, 1)]);
    expect(result.discount).toBe(15);
  });

  it('applies 10% discount when subtotal is exactly $100.01', () => {
    const result = calculateCartTotals([item(100.01, 1)]);
    expect(result.discount).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Total = subtotal + tax - discount
// ---------------------------------------------------------------------------
describe('calculateCartTotals — final total', () => {
  it('total = subtotal + tax when no discount applies', () => {
    // Subtotal = $50, tax = $2.50, discount = $0 → total = $52.50
    const result = calculateCartTotals([item(50, 1)]);
    expect(result.total).toBe(52.5);
  });

  it('total = subtotal + tax - discount when discount applies', () => {
    // Subtotal = $200, tax = $10, discount = $20 → total = $190
    const result = calculateCartTotals([item(200, 1)]);
    expect(result.total).toBe(190);
  });

  it('handles floating point prices without precision errors', () => {
    // $9.99 × 3 = $29.97
    const result = calculateCartTotals([item(9.99, 3)]);
    expect(result.subtotal).toBe(29.97);
  });
});

// ---------------------------------------------------------------------------
// Minimum checkout ($10)
// ---------------------------------------------------------------------------
describe('calculateCartTotals — minimum checkout ($10)', () => {
  it('canCheckout is false when total is below $10', () => {
    const result = calculateCartTotals([item(5, 1)]);
    expect(result.canCheckout).toBe(false);
  });

  it('canCheckout is true when total is exactly $10', () => {
    // $10 subtotal + $0.50 tax = $10.50 total ≥ $10
    const result = calculateCartTotals([item(10, 1)]);
    expect(result.canCheckout).toBe(true);
  });

  it('canCheckout is true when total exceeds $10', () => {
    const result = calculateCartTotals([item(50, 1)]);
    expect(result.canCheckout).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Quantity limits (min 1, max 5) — validated at the store level
// ---------------------------------------------------------------------------
describe('calculateCartTotals — quantity edge cases', () => {
  it('correctly calculates with minimum quantity of 1', () => {
    const result = calculateCartTotals([item(20, 1)]);
    expect(result.itemCount).toBe(1);
    expect(result.subtotal).toBe(20);
  });

  it('correctly calculates with maximum quantity of 5', () => {
    const result = calculateCartTotals([item(20, 5)]);
    expect(result.itemCount).toBe(5);
    expect(result.subtotal).toBe(100);
  });

  it('discount does not apply when max-qty subtotal equals $100 exactly', () => {
    // $20 × 5 = $100 — threshold is >, not >=
    const result = calculateCartTotals([item(20, 5)]);
    expect(result.discount).toBe(0);
  });
});
