import { useState } from 'react'
import { Heart, Minus, Plus, ShoppingBag, Star } from 'lucide-react'
import type { Product } from '../../data/products'
import { formatPrice } from '../../data/productSelectors'
import { cn } from '../../lib/utils'
import { useAppStore } from '../../store/useAppStore'

interface ProductInfoPanelProps {
  product: Product
}

const badgeLabels = {
  bestseller: 'Bestseller',
  new: 'New',
  limited: 'Limited',
} as const

export function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  const initialVariant =
    product.variants.find((variant) => variant.id === product.defaultVariantId) ??
    product.variants[0]
  const [selectedVariantId, setSelectedVariantId] = useState(
    initialVariant?.id ?? '',
  )
  const [quantity, setQuantity] = useState(1)
  const [cartNotice, setCartNotice] = useState({ message: '', sequence: 0 })
  const { wishlist, toggleWishlist, addToCart } = useAppStore()
  const selectedVariant = product.variants.find(
    (variant) => variant.id === selectedVariantId,
  )
  const isWishlisted = wishlist.includes(product.id)
  const canAddToCart = Boolean(selectedVariant?.inStock)

  const handleAddToCart = () => {
    if (!selectedVariant?.inStock) return

    addToCart(product.id, selectedVariant.id, quantity)
    setCartNotice((current) => ({
      message: `Added ${quantity} ${product.name} to cart`,
      sequence: current.sequence + 1,
    }))
  }

  return (
    <section aria-labelledby="product-title" className="lg:sticky lg:top-24">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[10px] font-medium uppercase tracking-folio text-brass">
          {product.brand}
        </p>
        {product.badges.map((badge) => (
          <span
            key={badge}
            className="border border-charcoal/15 px-2 py-1 text-[9px] font-medium uppercase tracking-folio text-charcoal/65"
          >
            {badgeLabels[badge]}
          </span>
        ))}
      </div>

      <h1
        id="product-title"
        className="mt-4 font-serif text-4xl leading-tight text-charcoal md:text-5xl"
      >
        {product.name}
      </h1>
      <p className="mt-3 font-serif text-base italic leading-relaxed text-charcoal/70">
        {product.subtitle}
      </p>

      <div
        className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-charcoal/65"
        role="img"
        aria-label={`Rated ${product.rating.value.toFixed(1)} out of 5 from ${product.rating.count} reviews`}
      >
        <span className="flex items-center gap-0.5 text-brass" aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              className={cn(
                'h-3.5 w-3.5',
                index < Math.round(product.rating.value)
                  ? 'fill-current'
                  : 'text-brass/30',
              )}
            />
          ))}
        </span>
        <span className="font-medium tabular-nums text-charcoal">
          {product.rating.value.toFixed(1)}
        </span>
        <span>({product.rating.count} reviews)</span>
      </div>

      <p
        data-product-price
        className="mt-6 text-xl font-medium tabular-nums text-charcoal"
      >
        {formatPrice(selectedVariant?.price ?? product.price)}
      </p>

      <div className="mt-6 border-y border-charcoal/10 py-5">
        {product.variants.length > 1 ? (
          <fieldset>
            <legend className="text-[10px] font-medium uppercase tracking-folio text-charcoal/65">
              Select size
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <label
                  key={variant.id}
                  className={cn(
                    'cursor-pointer border px-4 py-3 text-xs transition-colors focus-within:ring-2 focus-within:ring-oxblood focus-within:ring-offset-2 focus-within:ring-offset-ivory',
                    selectedVariantId === variant.id
                      ? 'border-charcoal bg-charcoal text-ivory'
                      : 'border-charcoal/20 text-charcoal',
                    !variant.inStock && 'cursor-not-allowed opacity-45',
                  )}
                >
                  <input
                    type="radio"
                    name={`${product.id}-variant`}
                    value={variant.id}
                    checked={selectedVariantId === variant.id}
                    disabled={!variant.inStock}
                    onChange={() => setSelectedVariantId(variant.id)}
                    aria-label={`${variant.size} — ${formatPrice(variant.price)}`}
                    className="sr-only"
                  />
                  <span>{variant.size}</span>
                  <span className="ml-2 opacity-70">{formatPrice(variant.price)}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : (
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-charcoal/60">Size</span>
            <span className="font-medium text-charcoal">
              {selectedVariant?.size ?? 'Unavailable'}
            </span>
          </div>
        )}
        <p className="mt-3 text-[10px] font-medium uppercase tracking-wider text-olive">
          {selectedVariant?.inStock ? 'In stock' : 'Out of stock'}
        </p>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-charcoal/75">
        {product.shortDescription}
      </p>

      <div className="mt-7 flex items-stretch gap-3">
        <div className="flex min-h-12 items-center border border-charcoal/20">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            disabled={quantity === 1}
            aria-label="Decrease quantity"
            className="inline-flex h-12 w-12 items-center justify-center text-charcoal disabled:opacity-35"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <output
            aria-label="Quantity"
            className="w-9 text-center text-sm font-medium tabular-nums"
          >
            {quantity}
          </output>
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.min(10, current + 1))}
            disabled={quantity === 10}
            aria-label="Increase quantity"
            className="inline-flex h-12 w-12 items-center justify-center text-charcoal disabled:opacity-35"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!canAddToCart}
          aria-label={`Add ${quantity} to cart`}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 bg-charcoal px-5 text-[10px] font-medium uppercase tracking-folio text-ivory transition-colors hover:bg-oxblood disabled:pointer-events-none disabled:opacity-45"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Add to cart
        </button>
      </div>

      <button
        type="button"
        onClick={() => toggleWishlist(product.id)}
        aria-label={
          isWishlisted
            ? `Remove ${product.name} from wishlist`
            : `Add ${product.name} to wishlist`
        }
        aria-pressed={isWishlisted}
        className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 border border-charcoal/20 px-5 text-[10px] font-medium uppercase tracking-folio text-charcoal transition-colors hover:border-oxblood hover:text-oxblood"
      >
        <Heart
          className={cn(
            'h-4 w-4',
            isWishlisted && 'fill-oxblood text-oxblood',
          )}
          aria-hidden="true"
        />
        {isWishlisted ? 'Saved to wishlist' : 'Add to wishlist'}
      </button>

      <p
        role="status"
        aria-live="polite"
        aria-label={
          cartNotice.message
            ? `${cartNotice.message}. Confirmation ${cartNotice.sequence}`
            : undefined
        }
        className="mt-3 min-h-5 text-xs text-olive"
      >
        {cartNotice.message}
      </p>
      <p className="mt-4 border-t border-charcoal/10 pt-4 text-xs leading-relaxed text-charcoal/60">
        {product.shippingNote}
      </p>
    </section>
  )
}
