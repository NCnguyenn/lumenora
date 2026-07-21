import type { Product, ProductTag, ProductVariant } from './types'

export const PRODUCT_TAG_LABELS = {
  new: 'NEW',
  sale: 'SALE',
  'best-seller': 'BEST SELLER',
} as const satisfies Record<ProductTag, string>

export interface ProductMerchandising {
  tag: ProductTag | null
  label: (typeof PRODUCT_TAG_LABELS)[ProductTag] | null
  price: number
  compareAtPrice: number | null
  isSale: boolean
}

export function getDefaultVariant(product: Product): ProductVariant | undefined {
  return (
    product.variants.find((variant) => variant.id === product.defaultVariantId) ??
    product.variants[0]
  )
}

export function getProductMerchandising(
  product: Product,
  variant: ProductVariant | undefined = getDefaultVariant(product),
): ProductMerchandising {
  const price = variant?.price ?? product.price

  if (product.tag === 'sale') {
    const compareAtPrice = variant?.compareAtPrice
    if (compareAtPrice === undefined || compareAtPrice <= price) {
      if (import.meta.env.DEV) {
        console.warn(`Invalid sale pricing for product ${product.id}`)
      }
      return {
        tag: null,
        label: null,
        price,
        compareAtPrice: null,
        isSale: false,
      }
    }

    return {
      tag: 'sale',
      label: PRODUCT_TAG_LABELS.sale,
      price,
      compareAtPrice,
      isSale: true,
    }
  }

  return {
    tag: product.tag,
    label: product.tag ? PRODUCT_TAG_LABELS[product.tag] : null,
    price,
    compareAtPrice: null,
    isSale: false,
  }
}
