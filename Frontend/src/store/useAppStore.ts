import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getProductById } from '../data/productSelectors';

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

interface AppState {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (productId: string, variantId: string, quantity?: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
}

function isValidCartItem(item: CartItem): boolean {
  const product = getProductById(item.productId);
  if (!product) return false;
  return product.variants.some((variant) => variant.id === item.variantId);
}

function migrateCart(rawCart: unknown): CartItem[] {
  if (!Array.isArray(rawCart)) return [];

  const migrated: CartItem[] = [];

  for (const raw of rawCart) {
    if (!raw || typeof raw !== 'object') continue;
    const entry = raw as Record<string, unknown>;

    // New shape
    if (typeof entry.productId === 'string' && typeof entry.variantId === 'string') {
      const quantity =
        typeof entry.quantity === 'number' && entry.quantity > 0
          ? Math.floor(entry.quantity)
          : 1;
      const item: CartItem = {
        productId: entry.productId,
        variantId: entry.variantId,
        quantity,
      };
      if (isValidCartItem(item)) migrated.push(item);
      continue;
    }

    // Legacy full Product shape: { id, quantity, defaultVariantId?, variants? }
    const productId =
      typeof entry.id === 'string'
        ? entry.id
        : typeof entry.productId === 'string'
          ? entry.productId
          : null;
    if (!productId) continue;

    const product = getProductById(productId);
    if (!product) continue;

    let variantId =
      typeof entry.variantId === 'string'
        ? entry.variantId
        : typeof entry.defaultVariantId === 'string'
          ? entry.defaultVariantId
          : product.defaultVariantId;

    if (!product.variants.some((variant) => variant.id === variantId)) {
      variantId = product.defaultVariantId;
    }

    const quantity =
      typeof entry.quantity === 'number' && entry.quantity > 0
        ? Math.floor(entry.quantity)
        : 1;

    migrated.push({ productId, variantId, quantity });
  }

  // Merge duplicate productId+variantId lines
  const byKey = new Map<string, CartItem>();
  for (const item of migrated) {
    const key = `${item.productId}:${item.variantId}`;
    const existing = byKey.get(key);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      byKey.set(key, { ...item });
    }
  }
  return Array.from(byKey.values());
}

function migrateWishlist(rawWishlist: unknown): string[] {
  if (!Array.isArray(rawWishlist)) return [];
  const ids = rawWishlist.filter((id): id is string => typeof id === 'string');
  return Array.from(new Set(ids.filter((id) => Boolean(getProductById(id)))));
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      addToCart: (productId, variantId, quantity = 1) =>
        set((state) => {
          const product = getProductById(productId);
          if (!product) return state;
          if (!product.variants.some((variant) => variant.id === variantId)) {
            return state;
          }
          const safeQty = Math.max(1, Math.floor(quantity));
          const existing = state.cart.find(
            (item) =>
              item.productId === productId && item.variantId === variantId,
          );
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.productId === productId && item.variantId === variantId
                  ? { ...item, quantity: item.quantity + safeQty }
                  : item,
              ),
            };
          }
          return {
            cart: [
              ...state.cart,
              { productId, variantId, quantity: safeQty },
            ],
          };
        }),
      removeFromCart: (productId, variantId) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) =>
              !(item.productId === productId && item.variantId === variantId),
          ),
        })),
      updateQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item.productId === productId && item.variantId === variantId
                ? { ...item, quantity: Math.max(1, Math.floor(quantity)) }
                : item,
            )
            .filter((item) => item.quantity > 0),
        })),
      toggleWishlist: (productId) =>
        set((state) => {
          if (!getProductById(productId)) return state;
          return {
            wishlist: state.wishlist.includes(productId)
              ? state.wishlist.filter((id) => id !== productId)
              : [...state.wishlist, productId],
          };
        }),
    }),
    {
      name: 'lumenora-storage',
      version: 2,
      migrate: (persistedState, version) => {
        const state = (persistedState ?? {}) as {
          cart?: unknown;
          wishlist?: unknown;
        };

        // version is undefined / 0 for pre-versioned storage
        if (version < 2) {
          return {
            cart: migrateCart(state.cart),
            wishlist: migrateWishlist(state.wishlist),
          };
        }

        return {
          cart: migrateCart(state.cart),
          wishlist: migrateWishlist(state.wishlist),
        };
      },
      // Re-validate on every rehydrate in case catalog dropped a SKU mid-session
      merge: (persistedState, currentState) => {
        const incoming = (persistedState ?? {}) as Partial<AppState>;
        return {
          ...currentState,
          ...incoming,
          cart: migrateCart(incoming.cart ?? currentState.cart),
          wishlist: migrateWishlist(incoming.wishlist ?? currentState.wishlist),
        };
      },
    },
  ),
);
