import type { ProductMerchandising } from '../../data/productMerchandising'
import { formatPrice } from '../../data/productSelectors'
import { cn } from '../../lib/utils'

interface ProductPriceProps {
  merchandising: ProductMerchandising
  compact?: boolean
  className?: string
}

export function ProductPrice({
  merchandising,
  compact = false,
  className,
}: ProductPriceProps) {
  return (
    <div
      data-product-prices
      className={cn(
        'flex flex-wrap items-baseline gap-x-2 gap-y-1 tabular-nums',
        compact ? 'text-xs' : 'text-sm',
        className,
      )}
    >
      {merchandising.isSale && merchandising.compareAtPrice !== null && (
        <del className="text-charcoal/50">
          <span className="sr-only">Original price</span>
          {' '}
          {formatPrice(merchandising.compareAtPrice)}
        </del>
      )}
      <span
        data-product-price
        className={cn(
          'font-medium',
          merchandising.isSale ? 'text-oxblood' : 'text-charcoal',
        )}
      >
        {merchandising.isSale && (
          <span className="sr-only">Sale price</span>
        )}
        {merchandising.isSale && ' '}
        {formatPrice(merchandising.price)}
      </span>
    </div>
  )
}
