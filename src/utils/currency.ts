/** 1 USD → INR conversion rate */
const USD_TO_INR = 84.5;

/**
 * Convert USD price to INR and format as ₹XX,XX,XXX
 */
export function formatINR(usdPrice: number): string {
  const inr = usdPrice * USD_TO_INR;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(inr));
}

/**
 * Convert USD to INR number
 */
export function toINR(usdPrice: number): number {
  return Math.round(usdPrice * USD_TO_INR);
}
