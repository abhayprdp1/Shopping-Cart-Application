/**
 * Format a USD price as a dollar string, e.g. $24.99
 * The DummyJSON API provides prices in USD as per the assignment spec.
 */
export function formatINR(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Return the price as a plain number (no conversion needed — already USD).
 */
export function toINR(price: number): number {
  return price;
}
