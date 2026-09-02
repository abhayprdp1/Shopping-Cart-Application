// Core product type from dummyjson API
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images: string[];
  tags?: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

// Checkout / shipping form
export interface ShippingFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Cart calculations
export interface CartCalculations {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  itemCount: number;
}

// Filters
export interface FilterState {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: SortOption;
}

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating-desc' | 'name-asc';

// Checkout steps
export type CheckoutStep = 'cart' | 'shipping' | 'payment';
