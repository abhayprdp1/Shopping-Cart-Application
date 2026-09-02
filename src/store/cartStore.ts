import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem } from '../types';

const MAX_QUANTITY = 5;

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        const existing = get().items.find((i) => i.product.id === product.id);
        if (existing) {
          // Increase qty up to MAX_QUANTITY
          set({
            items: get().items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: Math.min(i.quantity + 1, MAX_QUANTITY) }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { product, quantity: 1 }] });
        }
      },

      removeItem: (productId: number) => {
        set({ items: get().items.filter((i) => i.product.id !== productId) });
      },

      updateQuantity: (productId: number, quantity: number) => {
        const clamped = Math.max(1, Math.min(quantity, MAX_QUANTITY));
        set({
          items: get().items.map((i) =>
            i.product.id === productId ? { ...i, quantity: clamped } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'shopping-cart', // localStorage key
    }
  )
);
