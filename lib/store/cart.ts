import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  food_id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface CartStore {
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: string | null;
  addItem: (item: Omit<CartItem, "quantity" | "subtotal">) => void;
  removeItem: (food_id: string) => void;
  updateQuantity: (food_id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalAmount: 0,
      deliveryAddress: null,

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.food_id === item.food_id);

          if (existingItem) {
            return {
              ...state,
              items: state.items.map((i) =>
                i.food_id === item.food_id
                  ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.price }
                  : i
              ),
              totalAmount: state.totalAmount + item.price,
            };
          }

          return {
            ...state,
            items: [...state.items, { ...item, quantity: 1, subtotal: item.price }],
            totalAmount: state.totalAmount + item.price,
          };
        }),

      removeItem: (food_id) =>
        set((state) => {
          const itemToRemove = state.items.find((i) => i.food_id === food_id);
          if (!itemToRemove) return state;

          return {
            ...state,
            items: state.items.filter((i) => i.food_id !== food_id),
            totalAmount: state.totalAmount - itemToRemove.subtotal,
          };
        }),

      updateQuantity: (food_id, quantity) =>
        set((state) => {
          const item = state.items.find((i) => i.food_id === food_id);
          if (!item) return state;

          return {
            ...state,
            items: state.items.map((i) =>
              i.food_id === food_id ? { ...i, quantity, subtotal: quantity * i.price } : i
            ),
            totalAmount: state.totalAmount - item.subtotal + quantity * item.price,
          };
        }),

      clearCart: () =>
        set({
          items: [],
          totalAmount: 0,
          deliveryAddress: null,
        }),

      getTotal: () => {
        return get().totalAmount;
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
