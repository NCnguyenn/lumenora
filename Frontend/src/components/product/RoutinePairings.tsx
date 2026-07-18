import type { Product } from '../../data/types'
import { getRoutinePairings } from '../../data/productSelectors'
import { ProductRail } from './ProductRail'

interface RoutinePairingsProps {
  product: Product
  /** Prefer excluding products already shown in the Similar rail */
  excludeIds?: string[]
  limit?: number
}

export function RoutinePairings({
  product,
  excludeIds = [],
  limit = 4,
}: RoutinePairingsProps) {
  const items = getRoutinePairings(product, limit, excludeIds)

  return (
    <ProductRail
      eyebrow="Ritual"
      title="Complete the Ritual"
      label="Complete the Ritual"
      products={items}
    />
  )
}
