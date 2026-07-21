import { describe, expect, it, vi } from 'vitest'
import { products } from './products'
import { getProductMerchandising } from './productMerchandising'

describe('getProductMerchandising', () => {
  it('returns the approved label and default-variant price', () => {
    const product = products.find((item) => item.id === 'p1')!

    expect(getProductMerchandising(product)).toEqual({
      tag: 'new',
      label: 'NEW',
      price: 45,
      compareAtPrice: null,
      isSale: false,
    })
  })

  it('returns original and sale prices for a valid sale', () => {
    const product = products.find((item) => item.id === 'p6')!

    expect(getProductMerchandising(product)).toEqual({
      tag: 'sale',
      label: 'SALE',
      price: 26,
      compareAtPrice: 32,
      isSale: true,
    })
  })

  it('suppresses a malformed sale at runtime', () => {
    const product = structuredClone(
      products.find((item) => item.id === 'p6')!,
    )
    product.variants[0].compareAtPrice = product.variants[0].price
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    expect(getProductMerchandising(product)).toEqual({
      tag: null,
      label: null,
      price: 26,
      compareAtPrice: null,
      isSale: false,
    })
    expect(warning).toHaveBeenCalledOnce()

    warning.mockRestore()
  })
})
