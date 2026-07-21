import { PRODUCT_TAG_LABELS } from '../../data/productMerchandising'
import type { ProductTag as ProductTagValue } from '../../data/types'
import { cn } from '../../lib/utils'

interface ProductTagProps {
  tag: ProductTagValue | null
  placement?: 'overlay' | 'inline'
  className?: string
}

export function ProductTag({
  tag,
  placement = 'overlay',
  className,
}: ProductTagProps) {
  if (!tag) return null

  return (
    <span
      data-product-tag={tag}
      className={cn(
        'z-10 inline-flex bg-oxblood px-3 py-2 text-[10px] font-medium uppercase tracking-folio text-white',
        placement === 'overlay' && 'absolute left-3 top-3',
        placement === 'overlay' &&
          tag === 'best-seller' &&
          'max-w-16 justify-center px-2 text-center text-[9px] leading-tight tracking-[0.16em] sm:max-w-none sm:px-3 sm:text-[10px] sm:leading-normal sm:tracking-folio',
        className,
      )}
    >
      {PRODUCT_TAG_LABELS[tag]}
    </span>
  )
}
