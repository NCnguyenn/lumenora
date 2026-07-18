import type { ReactNode } from 'react'
import { Leaf, Package, Plus, Truck } from 'lucide-react'
import type { Brand, Product } from '../../data/types'

interface ProductDetailsAccordionProps {
  product: Product
  brand?: Brand
}

interface DetailSectionProps {
  title: string
  icon?: ReactNode
  children: ReactNode
  open?: boolean
}

function DetailSection({ title, icon, children, open = false }: DetailSectionProps) {
  return (
    <details open={open} className="group border-b border-charcoal/15">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[10px] font-medium uppercase tracking-folio text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal [&::-webkit-details-marker]:hidden">
        <div className="flex items-center gap-3">
          {icon && <span className="text-charcoal/70">{icon}</span>}
          {title}
        </div>
        <Plus
          className="h-4 w-4 shrink-0 transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </summary>
      <div className="pb-7 text-sm leading-relaxed text-charcoal/72 pl-8">
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
      <DetailSection title="Product details" icon={<Package className="h-5 w-5" />} open>
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
        <div className="mt-6">
           <h3 className="text-[10px] font-medium uppercase tracking-folio text-charcoal mb-3">Product Facts</h3>
           <dl>
             <FactRow label="Type" value={product.productType} />
             <FactRow label="Routine step" value={product.routineStep} />
             <FactRow label="Skin types" value={product.skinTypes.join(', ')} />
             <FactRow label="Texture" value={product.texture} />
           </dl>
        </div>
      </DetailSection>

      <DetailSection title="Full ingredients" icon={<Leaf className="h-5 w-5" />}>
        <p>{product.fullIngredients}</p>
      </DetailSection>

      <DetailSection title="Shipping & returns" icon={<Truck className="h-5 w-5" />}>
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
