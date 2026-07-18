import { beforeEach, describe, expect, it } from 'vitest'
import { products } from '../data/products'
import { useAppStore } from './useAppStore'

const product = products[0]
const variantId = product.defaultVariantId

beforeEach(() => {
  localStorage.clear()
  useAppStore.setState({ cart: [], wishlist: [] })
})

describe('useAppStore cart shape', () => {
  it('stores cart lines as productId + variantId + quantity', () => {
    useAppStore.getState().addToCart(product.id, variantId, 2)
    expect(useAppStore.getState().cart).toEqual([
      { productId: product.id, variantId, quantity: 2 },
    ])

    useAppStore.getState().addToCart(product.id, variantId, 1)
    expect(useAppStore.getState().cart[0].quantity).toBe(3)
  })

  it('ignores unknown product or variant ids', () => {
    useAppStore.getState().addToCart('not-real', variantId)
    useAppStore.getState().addToCart(product.id, 'not-a-variant')
    expect(useAppStore.getState().cart).toEqual([])
  })

  it('updates and removes by productId + variantId', () => {
    useAppStore.getState().addToCart(product.id, variantId, 1)
    useAppStore.getState().updateQuantity(product.id, variantId, 5)
    expect(useAppStore.getState().cart[0].quantity).toBe(5)

    useAppStore.getState().removeFromCart(product.id, variantId)
    expect(useAppStore.getState().cart).toEqual([])
  })

  it('migrates legacy full-product cart rows from localStorage', async () => {
    localStorage.setItem(
      'lumenora-storage',
      JSON.stringify({
        state: {
          cart: [
            {
              id: product.id,
              name: product.name,
              price: product.price,
              defaultVariantId: product.defaultVariantId,
              quantity: 4,
              image: product.image,
            },
            {
              id: 'ghost-sku',
              name: 'Removed SKU',
              quantity: 1,
            },
          ],
          wishlist: [product.id, 'ghost-sku'],
        },
        version: 0,
      }),
    )

    await useAppStore.persist.rehydrate()

    const state = useAppStore.getState()
    expect(state.cart).toEqual([
      {
        productId: product.id,
        variantId: product.defaultVariantId,
        quantity: 4,
      },
    ])
    expect(state.wishlist).toEqual([product.id])
  })
})
