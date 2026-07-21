import { useEffect, useRef, useState } from 'react'
import { Heart, Minus, Plus, ShoppingBag, Star, Truck } from 'lucide-react'
import type { Product } from '../../data/products'
import { formatPrice } from '../../data/productSelectors'
import { cn } from '../../lib/utils'
import { useAppStore } from '../../store/useAppStore'
import { toast } from 'sonner'
import { getProductMerchandising } from '../../data/productMerchandising'
import { ProductPrice } from '../ui/ProductPrice'
import { ProductTag } from '../ui/ProductTag'

interface ProductInfoPanelProps {
  product: Product
}

export function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  const initialVariant =
    product.variants.find((variant) => variant.id === product.defaultVariantId) ??
    product.variants[0]
  const [selectedVariantId, setSelectedVariantId] = useState(
    initialVariant?.id ?? '',
  )
  const [quantity, setQuantity] = useState(1)
  const [cartNotice, setCartNotice] = useState({ message: '', sequence: 0 })
  const [showSticky, setShowSticky] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const { wishlist, toggleWishlist, addToCart } = useAppStore()
  const selectedVariant = product.variants.find(
    (variant) => variant.id === selectedVariantId,
  )
  const merchandising = getProductMerchandising(product, selectedVariant)
  const isWishlisted = wishlist.includes(product.id)
  const canAddToCart = Boolean(selectedVariant?.inStock)
  const addToCartLabel = `Add ${quantity} ${product.name} to cart`
  const compactAddLabel = `Add ${quantity} to cart`

  const handleAddToCart = () => {
    if (!selectedVariant?.inStock) return

    addToCart(product.id, selectedVariant.id, quantity)
    toast.success(`Added "${product.name}" to cart!`)
    setCartNotice((current) => ({
      message: `Added ${quantity} ${product.name} to cart`,
      sequence: current.sequence + 1,
    }))
  }

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky ATC once the primary buy box has scrolled above the viewport
        setShowSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0)
      },
      { threshold: 0, rootMargin: '0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Mark body so layout can reserve bottom space while sticky ATC is visible (mobile)
  useEffect(() => {
    const className = 'pdp-sticky-atc-visible'
    if (showSticky) {
      document.body.classList.add(className)
    } else {
      document.body.classList.remove(className)
    }
    return () => document.body.classList.remove(className)
  }, [showSticky])

  return (
    <section aria-labelledby="product-title">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[10px] font-medium uppercase tracking-folio text-brass">
          {product.brand}
        </p>
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

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <ProductPrice merchandising={merchandising} className="text-xl" />
        <ProductTag tag={merchandising.tag} placement="inline" />
      </div>

      {product.relatedTags && product.relatedTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {product.relatedTags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-charcoal/20 px-3 py-1 text-[10px] font-medium capitalize text-charcoal/75"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 border-t border-charcoal/10 pt-5 flex flex-col gap-6">
        <div className="flex flex-row items-end justify-between gap-6">
          {product.variants.length > 1 ? (
            <fieldset>
              <legend className="mb-3 text-[10px] font-medium uppercase tracking-folio text-charcoal/65">
                SIZE
              </legend>
              <div className="flex flex-wrap gap-2">
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
                  </label>
                ))}
              </div>
            </fieldset>
          ) : (
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-medium uppercase tracking-folio text-charcoal/65">SIZE</span>
              <div className="border border-charcoal text-charcoal px-4 py-3 text-xs font-medium inline-block w-fit">
                {selectedVariant?.size ?? 'Unavailable'}
              </div>
            </div>
          )}

          <div>
            <p className="mb-3 text-[10px] font-medium uppercase tracking-folio text-charcoal/65 lg:text-left text-right">
              <span className="hidden lg:inline">QUANTITY</span>
              <span className="inline lg:hidden">QTY</span>
            </p>
            <div className="flex min-h-12 w-fit items-center border border-charcoal/20">
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                disabled={quantity === 1}
                aria-label="Decrease quantity"
                className="inline-flex h-12 w-12 items-center justify-center text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal disabled:opacity-35"
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
                className="inline-flex h-12 w-12 items-center justify-center text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal disabled:opacity-35"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-[10px] font-medium uppercase tracking-wider text-olive hidden">
        {selectedVariant?.inStock ? 'In stock' : 'Out of stock'}
      </p>

      {/* Sentinel sits with primary ATC so sticky appears after buy box leaves view */}
      <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />

      <div className="mt-7 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!canAddToCart}
          aria-label={compactAddLabel}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-charcoal px-5 text-[10px] font-medium uppercase tracking-folio text-ivory transition-colors hover:bg-oxblood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal disabled:pointer-events-none disabled:opacity-45"
        >
          ADD TO CART
        </button>

        <button
          type="button"
          onClick={() => {
            toggleWishlist(product.id)
            if (!isWishlisted) {
              toast.success(`Added "${product.name}" to wishlist!`)
            } else {
              toast(`Removed "${product.name}" from wishlist`)
            }
          }}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={isWishlisted}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 border border-charcoal/20 px-5 text-[10px] font-medium uppercase tracking-folio text-charcoal transition-colors hover:border-charcoal hover:bg-charcoal/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
        >
          <Heart
            className={cn(
              'h-4 w-4',
              isWishlisted && 'fill-oxblood text-oxblood',
            )}
            aria-hidden="true"
          />
          {isWishlisted ? 'SAVED TO WISHLIST' : 'ADD TO WISHLIST'}
        </button>
      </div>

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
      
      <div className="mt-4 flex items-center gap-2 border-t border-charcoal/10 pt-4 text-[10px] font-medium uppercase tracking-folio text-olive">
        <Truck className="h-4 w-4" aria-hidden="true" />
        <span>Free shipping over $50</span>
      </div>

      {/* Sticky Mobile ATC — hidden on lg+ (desktop uses sticky info column) */}
      <div
        role="region"
        aria-label="Quick add to cart"
        data-sticky-atc
        data-visible={showSticky ? 'true' : 'false'}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between gap-4 border-t border-charcoal/15 bg-ivory/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-transform duration-300 ease-in-out motion-reduce:transition-none lg:hidden',
          showSticky ? 'translate-y-0' : 'pointer-events-none translate-y-full',
        )}
        aria-hidden={!showSticky}
      >
        <div className="min-w-0 flex flex-col">
          <span className="truncate text-[10px] font-medium uppercase tracking-folio text-charcoal/70">
            {product.name}
          </span>
          <span className="font-medium tabular-nums text-charcoal">
            {formatPrice(selectedVariant?.price ?? product.price)}
            {selectedVariant?.size ? (
              <span className="ml-2 text-[11px] font-normal text-charcoal/55">
                {selectedVariant.size}
              </span>
            ) : null}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!canAddToCart || !showSticky}
          tabIndex={showSticky ? 0 : -1}
          aria-label={addToCartLabel}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-charcoal px-6 text-[10px] font-medium uppercase tracking-folio text-ivory transition-colors hover:bg-oxblood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal disabled:pointer-events-none disabled:opacity-45"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Add to cart
        </button>
      </div>
    </section>
  )
}
