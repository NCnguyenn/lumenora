import { Droplets, Leaf, Sprout } from 'lucide-react'
import type { Product } from '../../data/products'

interface ProductHighlightsProps {
  product: Product
}

const highlights = [
  {
    title: 'Why it works',
    icon: Sprout,
    getCopy: (product: Product) =>
      product.benefits[0] ?? 'Thoughtful formulas for a calmer, healthier-looking barrier.',
  },
  {
    title: 'How to use',
    icon: Droplets,
    getCopy: (product: Product) =>
      product.howToUse[0] ?? 'Apply a small amount and layer with the rest of your ritual.',
  },
  {
    title: 'Ingredients',
    icon: Leaf,
    getCopy: (product: Product) =>
      product.keyIngredients
        .slice(0, 2)
        .map((ingredient) => ingredient.name)
        .join(', ') || 'Considered ingredients, chosen for everyday use.',
  },
] as const

export function ProductHighlights({ product }: ProductHighlightsProps) {
  return (
    <section
      aria-label="Product highlights"
      className="grid border border-charcoal/10 bg-parchment/45 sm:grid-cols-3"
    >
      {highlights.map(({ title, icon: Icon, getCopy }, index) => (
        <article
          key={title}
          className={`grid grid-cols-[2rem_1fr] gap-3 p-4 sm:p-5 ${
            index > 0 ? 'border-t border-charcoal/10 sm:border-l sm:border-t-0' : ''
          }`}
        >
          <Icon className="mt-0.5 h-5 w-5 text-olive" strokeWidth={1.4} aria-hidden="true" />
          <div>
            <h2 className="font-serif text-base text-charcoal">{title}</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-charcoal/70">{getCopy(product)}</p>
          </div>
        </article>
      ))}
    </section>
  )
}
