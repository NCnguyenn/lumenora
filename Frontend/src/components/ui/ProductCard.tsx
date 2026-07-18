import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import type { Product } from '../../data/products';
import { formatPrice } from '../../data/products';
import { getHoverImage, getPrimaryImage } from '../../data/productSelectors';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [hoverImageFailed, setHoverImageFailed] = useState(false);
  const { wishlist, toggleWishlist, addToCart } = useAppStore();
  const isWishlisted = wishlist.includes(product.id);
  const primaryImage = getPrimaryImage(product);
  const hoverImage = getHoverImage(product);
  const canHoverSwap = Boolean(hoverImage) && !hoverImageFailed;
  const defaultVariant =
    product.variants.find((variant) => variant.id === product.defaultVariantId) ??
    product.variants[0];
  const badge = (['bestseller', 'new', 'limited'] as const).find((candidate) =>
    product.badges.includes(candidate),
  );

  if (!primaryImage) return null;

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col bg-ivory',
        className
      )}
    >
      <div className="group/image relative aspect-square overflow-hidden bg-parchment">
        {badge && (
          <span className="absolute left-3 top-3 z-10 bg-ivory/95 px-2 py-1 text-[9px] font-medium uppercase tracking-folio text-brass">
            {badge === 'bestseller'
              ? 'Bestseller'
              : badge === 'limited'
                ? 'Limited'
                : 'New'}
          </span>
        )}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-2 top-2 z-10 inline-flex h-11 w-11 items-center justify-center bg-ivory/85 text-charcoal transition-colors hover:bg-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={isWishlisted}
        >
          <Heart
            className={cn('h-4 w-4', isWishlisted && 'fill-oxblood text-oxblood')}
            aria-hidden
          />
        </button>
        <Link
          to={`/products/${product.slug}`}
          className="block h-full w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-charcoal"
        >
          <img
            src={primaryImage.src}
            alt={primaryImage.alt}
            width={primaryImage.width}
            height={primaryImage.height}
            loading="lazy"
            decoding="async"
            className={cn(
              'editorial-image absolute inset-0 h-full w-full object-cover transition-opacity duration-300 motion-reduce:transition-none',
              canHoverSwap &&
                '[@media(hover:hover)]:group-hover/image:opacity-0',
            )}
          />
          {hoverImage && canHoverSwap && (
            <img
              src={hoverImage.src}
              alt=""
              aria-hidden="true"
              width={hoverImage.width}
              height={hoverImage.height}
              loading="lazy"
              decoding="async"
              onError={() => setHoverImageFailed(true)}
              className="editorial-image absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 motion-reduce:transition-none [@media(hover:hover)]:group-hover/image:opacity-100"
            />
          )}
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 pt-4">
        <p className="text-[10px] font-medium uppercase tracking-folio text-brass">
          {product.brand}
        </p>
        <Link
          to={`/products/${product.slug}`}
          className="font-serif text-[15px] leading-snug text-charcoal transition-colors hover:text-oxblood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal line-clamp-2"
        >
          {product.name}
        </Link>
        <p className="text-[11px] leading-relaxed text-charcoal/60">
          {product.productType}
        </p>
        <div
          className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-charcoal/65"
          role="img"
          aria-label={`Rated ${product.rating.value.toFixed(1)} out of 5 from ${product.rating.count} reviews`}
        >
          <span className="flex items-center gap-0.5 text-brass" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                className={cn(
                  'h-3 w-3',
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
        {defaultVariant?.size && (
          <p className="text-[11px] text-charcoal/55">{defaultVariant.size}</p>
        )}
        <div className="mt-auto flex flex-col gap-3 pt-3">
          <p className="text-sm font-medium tabular-nums text-charcoal">
            {formatPrice(product.price)}
          </p>
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-charcoal/20 px-3 text-[10px] font-medium uppercase tracking-folio text-charcoal transition-colors hover:border-oxblood hover:bg-oxblood hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="h-3.5 w-3.5" aria-hidden />
            <span>Quick add</span>
          </button>
        </div>
      </div>
    </article>
  );
}
