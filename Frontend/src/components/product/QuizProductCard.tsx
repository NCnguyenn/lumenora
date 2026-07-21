import { Link } from 'react-router-dom'
import { getProductMerchandising } from '../../data/productMerchandising'
import { getPrimaryImage } from '../../data/productSelectors'
import type { Product } from '../../data/types'
import { ProductPrice } from '../ui/ProductPrice'
import { ProductTag } from '../ui/ProductTag'

interface QuizProductCardProps {
  product: Product
  stepNumber: number
  stepName: string
}

export function QuizProductCard({
  product,
  stepNumber,
  stepName,
}: QuizProductCardProps) {
  const primaryImage = getPrimaryImage(product)
  const merchandising = getProductMerchandising(product)

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex flex-col text-charcoal decoration-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
    >
      <div className="relative mb-5 flex aspect-[3/4] items-center justify-center overflow-hidden bg-gradient-to-b from-transparent to-[#D8D3CC]">
        <ProductTag tag={merchandising.tag} className="z-20" />
        <img
          src={primaryImage?.src || product.image}
          alt={primaryImage?.alt || product.name}
          className="relative z-10 mt-auto h-[80%] object-contain mix-blend-multiply drop-shadow-2xl transition-transform duration-500 group-hover:-translate-y-2"
        />
      </div>
      <span className="mb-1 font-serif text-[11px] text-[#1A1A1A]">
        {String(stepNumber).padStart(2, '0')}
      </span>
      <h4 className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
        {stepName}
      </h4>
      <p className="mb-1 font-serif text-sm leading-snug text-[#1A1A1A]">
        {product.name}
      </p>
      <p className="mb-3 line-clamp-2 text-[12px] leading-relaxed text-gray-600">
        {product.subtitle || 'Essential step in your routine.'}
      </p>
      <div className="mt-auto flex items-center justify-between">
        <ProductPrice merchandising={merchandising} compact />
        <span
          className="text-[12px] text-[#1A1A1A] opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        >
          →
        </span>
      </div>
    </Link>
  )
}
