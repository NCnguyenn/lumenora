import type { ReactNode } from 'react'
import { Plus } from 'lucide-react'
import type { Brand, Product } from '../../data/types'

interface ProductDetailsAccordionProps {
  product: Product
  brand?: Brand
}

interface DetailSectionProps {
  title: string
  children: ReactNode
  open?: boolean
}

function DetailSection({ title, children, open = false }: DetailSectionProps) {
  return (
    <details open={open} className="group border-b border-charcoal/15">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[10px] font-medium uppercase tracking-folio text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal [&::-webkit-details-marker]:hidden">
        {title}
        <Plus
          className="h-4 w-4 shrink-0 transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </summary>
      <div className="pb-7 text-sm leading-relaxed text-charcoal/72">
        {children}
      </div>
    </details>
  )
}

function FactRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null

  return (
    <div className="grid grid-cols-[8rem_1fr] gap-4 border-b border-charcoal/10 py-3 last:border-b-0">
      <dt className="text-[10px] font-medium uppercase tracking-wider text-charcoal/55">
        {label}
      </dt>
      <dd className="text-sm text-charcoal/75">{value}</dd>
    </div>
  )
}

export function ProductDetailsAccordion({
  product,
  brand,
}: ProductDetailsAccordionProps) {
  return (
    <section aria-label="Product details" className="border-t border-charcoal/15">
      <DetailSection title="Overview" open>
        <div className="space-y-3">
          {product.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <h3 className="mt-6 text-[10px] font-medium uppercase tracking-folio text-charcoal">
          Benefits
        </h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {product.benefits.map((benefit) => (
            <li key={benefit} className="border-l border-brass pl-3">
              {benefit}
            </li>
          ))}
        </ul>
      </DetailSection>

      <DetailSection title="Key ingredients">
        <ul className="grid gap-4 sm:grid-cols-2">
          {product.keyIngredients.map((ingredient) => (
            <li key={ingredient.name} className="border border-charcoal/10 p-4">
              <p className="font-medium text-charcoal">{ingredient.name}</p>
              <p className="mt-1 text-charcoal/65">{ingredient.benefit}</p>
            </li>
          ))}
        </ul>
      </DetailSection>

      <DetailSection title="Full ingredients">
        <p>{product.fullIngredients}</p>
      </DetailSection>

      <DetailSection title="How to use">
        <ol aria-label="How to use steps" className="space-y-3">
          {product.howToUse.map((step, index) => (
            <li key={step} className="grid grid-cols-[2rem_1fr] gap-3">
              <span className="font-serif text-lg text-brass" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </DetailSection>

      <DetailSection title="Product facts & care">
        <dl>
          <FactRow label="Type" value={product.productType} />
          <FactRow label="Routine step" value={product.routineStep} />
          <FactRow label="Use" value={product.usageTime.join(' · ')} />
          <FactRow label="Skin types" value={product.skinTypes.join(', ')} />
          <FactRow label="Concerns" value={product.concerns.join(', ')} />
          <FactRow label="Texture" value={product.texture} />
          <FactRow label="Finish" value={product.finish} />
          <FactRow label="Scent" value={product.scent} />
        </dl>
        {product.warnings.length > 0 && (
          <div className="mt-5 border-l-2 border-oxblood pl-4">
            <p className="text-[10px] font-medium uppercase tracking-folio text-oxblood">
              Care notes
            </p>
            <ul className="mt-2 space-y-2">
              {product.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        )}
      </DetailSection>

      <DetailSection title="Brand story">
        <p className="font-serif text-lg text-charcoal">{product.brand}</p>
        {brand ? (
          <div className="mt-3 space-y-3">
            <p>{brand.shortStory}</p>
            {brand.fullStory && <p>{brand.fullStory}</p>}
          </div>
        ) : (
          <p className="mt-3">A considered part of the Lumenora edit.</p>
        )}
      </DetailSection>

      <DetailSection title="Shipping & returns">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-folio text-charcoal">
              Shipping
            </p>
            <p className="mt-2">{product.shippingNote}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-folio text-charcoal">
              Returns
            </p>
            <p className="mt-2">{product.returnNote}</p>
          </div>
        </div>
      </DetailSection>
    </section>
  )
}
