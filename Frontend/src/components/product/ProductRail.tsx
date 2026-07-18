import type { Product } from '../../data/types'
import { ProductCard } from '../ui/ProductCard'

interface ProductRailProps {
  title: string
  eyebrow?: string
  products: Product[]
  /** Accessible region name; defaults to title */
  label?: string
}

/**
 * Shared editorial product rail for PDP (Similar / Routine) and future surfaces.
 * Renders nothing when the list is empty so pages stay clean for thin pairings.
 */
export function ProductRail({
  title,
  eyebrow,
  products: railProducts,
  label,
}: ProductRailProps) {
  if (railProducts.length === 0) return null

  return (
    <section
      aria-label={label ?? title}
      className="border-t border-charcoal/15 pt-14 lg:pt-20"
    >
      <header className="mb-8 max-w-2xl">
        {eyebrow ? (
          <p className="mb-3 text-[10px] font-medium uppercase tracking-folio text-brass">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-serif text-2xl text-charcoal md:text-3xl">{title}</h2>
      </header>

      <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7">
        {railProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
