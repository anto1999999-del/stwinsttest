import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ShippingRate, ShippingAddress } from "@/shared/api/shipping";
import { useEffect, useState } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  inventoryId?: string;
  category: string
}

interface CartState {
  items: CartItem[];
  selectedShipping: ShippingRate | null;
  deliveryAddress: ShippingAddress | null;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  setSelectedShipping: (shipping: ShippingRate | null) => void;
  setDeliveryAddress: (address: ShippingAddress | null) => void;
  getSubtotal: () => number;
  getShippingCost: () => number;
  getTotalWithShipping: () => number;
}

/** treat non-positive or “defaulty” dims as missing */
const isBad = (v: unknown) =>
  typeof v !== "number" || !Number.isFinite(v) || v <= 0;
  
const normalizeCategory = (v: unknown): string => {
  return typeof v === "string" ? v.trim() : "";
};

/** known legacy defaults we want to strip if they appear */
//const looksLikeLegacyDefault = (v?: number, target?: number) => typeof v === "number" && typeof target === "number" && v === target;

/** sanitize a single item’s dimensions */
function sanitizeDims<T extends CartItem>(item: T): T {
  const { weight, length, width, height } = item;

  const bad =
    isBad(weight) ||
    isBad(length) ||
    isBad(width) ||
    isBad(height);
    // strip legacy fallbacks 1 / 25 / 20 / 15 if any present
    /*looksLikeLegacyDefault(weight, 1) ||
    looksLikeLegacyDefault(length, 25) ||
    looksLikeLegacyDefault(width, 20) ||
    looksLikeLegacyDefault(height, 15);*/

  if (bad) {
    const clean = { ...item };
    delete clean.weight;
    delete clean.length;
    delete clean.width;
    delete clean.height;
    console.log("[Cart:sanitizeDims] stripped dims from item", {
      id: item.id,
      before: { weight, length, width, height },
      after: clean,
    });
    return clean;
  }

  return item;
}

export const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      items: [],
      selectedShipping: null,
      deliveryAddress: null,

      addItem: (raw) =>
		  set((state) => {
			// enforce category presence on the way in
			const normalized: CartItem = {
			  ...raw,
			  category: normalizeCategory((raw as CartItem).category),
			};

			if (!normalized.category) {
			  console.log("[Cart:addItem] MISSING category — item will not map to size table:", {
				id: normalized.id,
				name: normalized.name,
			  });
			} else {
			  console.log("[Cart:addItem] category OK:", {
				id: normalized.id,
				name: normalized.name,
				category: normalized.category,
			  });
			}

			const item = sanitizeDims(normalized);

			console.log("[Cart:addItem] incoming -> stored", { raw: normalized, stored: item });

			const found = state.items.find((i) => i.id === item.id);
			if (found) {
			  return {
				items: state.items.map((i) =>
				  i.id === item.id
					? sanitizeDims({ ...i, quantity: i.quantity + item.quantity })
					: i
				),
			  };
			}
			return { items: [...state.items, item] };
		  }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),

      clear: () =>
        set({ items: [], selectedShipping: null, deliveryAddress: null }),

      setSelectedShipping: (shipping) => set({ selectedShipping: shipping }),
      setDeliveryAddress: (address) => set({ deliveryAddress: address }),

      getSubtotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getShippingCost: () => get().selectedShipping?.cost || 0,
      getTotalWithShipping: () => {
        const s = get();
        return s.getSubtotal() + s.getShippingCost();
      },
    }),
    {
      name: "cart-storage",
      skipHydration: true,
      // 🔒 sanitize any legacy items when the store rehydrates
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        try {
          const cleaned = state.items.map(sanitizeDims);
          if (JSON.stringify(cleaned) !== JSON.stringify(state.items)) {
            console.log("[Cart:rehydrate] cleaned legacy defaults");
            state.items = cleaned as CartItem[];
          }
        } catch (e) {
          console.warn("[Cart:rehydrate] sanitize failed", e);
        }
      },
    }
  )
);

// Hydration helper unchanged
export const useCartStoreHydrated = () => {
  const [hydrated, setHydrated] = useState(false);
  const store = useCartStore();

  useEffect(() => {
    useCartStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  return hydrated ? store : { ...store, items: [] };
};
