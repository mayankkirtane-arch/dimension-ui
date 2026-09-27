/**
 * Global Cart Store (Zustand)
 * 
 * Manages the shopping cart state across the entire app.
 * Automatically applies a 20% bundle discount when 3+ paid templates are in the cart.
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { TemplateItem } from "@/lib/site";

export interface CartItem {
  id: string;
  name: string;
  price: string;
  numericPrice: number;
  tier: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (template: TemplateItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

function parsePrice(price: string): number {
  if (!price || price === "$0") return 0;
  return parseFloat(price.replace("$", "")) || 0;
}

export function getCartTotals(items: CartItem[]) {
  const paidItems = items.filter((i) => i.numericPrice > 0);
  const subtotal = items.reduce((sum, i) => sum + i.numericPrice, 0);
  const bundleDiscount = paidItems.length >= 3 ? 0.2 : 0;
  const discount = Math.round(subtotal * bundleDiscount * 100) / 100;
  const total = Math.round((subtotal - discount) * 100) / 100;
  return { subtotal, discount, total, bundleDiscount, paidItems };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      addItem: (template: TemplateItem) =>
        set((state) => {
          if (state.items.find((i) => i.id === template.id)) return state;
          const newItem: CartItem = {
            id: template.id,
            name: template.name,
            price: template.price,
            numericPrice: parsePrice(template.price),
            tier: template.tier,
          };
          return { items: [...state.items, newItem], isOpen: true };
        }),

      removeItem: (id: string) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "dimensionui-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
