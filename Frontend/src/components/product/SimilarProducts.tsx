import type { Product } from '../../data/types'
import { getSimilarProducts } from '../../data/productSelectors'
import { ProductRail } from './ProductRail'

interface SimilarProductsProps {
  product: Product
  /** Product ids already shown in another rail (e.g. routine) — kept empty when similar is resolved first */
  excludeIds?: string[]
  limit?: number
}

export function SimilarProducts({
  product,
  excludeIds = [],
  limit = 4,
}: SimilarProductsProps) {
  const items = getSimilarProducts(product, limit, excludeIds)

  return (
    <ProductRail
      eyebrow="Related"
      title="You May Also Like"
      label="You May Also Like"
      products={items}
    />
  )
}
