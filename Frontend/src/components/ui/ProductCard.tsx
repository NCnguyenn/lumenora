import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '../../data/products';
import { categoryLabel, formatPrice } from '../../data/products';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { wishlist, toggleWishlist, addToCart } = useAppStore();
  const isWishlisted = wishlist.includes(product.id);

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col border border-charcoal/10 bg-ivory',
        className
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-parchment">
        {(product.isNew || product.isBestSeller) && (
          <span className="absolute left-3 top-3 z-10 bg-charcoal px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-ivory">
            {product.isBestSeller ? 'Bestseller' : 'New'}
          </span>
        )}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-2 top-2 z-10 inline-flex h-11 w-11 items-center justify-center bg-ivory/90 text-charcoal transition-colors hover:bg-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
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
          to={`/shop?category=${product.category}`}
          className="block h-full w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-charcoal"
        >
          <img
            src={product.image}
            alt={`${product.brand} — ${product.name}`}
            width={640}
            height={800}
            loading="lazy"
            decoding="async"
            className="editorial-image h-full w-full object-cover"
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-[10px] font-medium uppercase tracking-folio text-brass">
          {product.brand}
        </p>
        <Link
          to={`/shop?category=${product.category}`}
          className="font-serif text-[15px] leading-snug text-charcoal transition-colors hover:text-oxblood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal line-clamp-2"
        >
          {product.name}
        </Link>
        <p className="text-[11px] uppercase tracking-wider text-charcoal/55">
          {categoryLabel(product.category)}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <p className="text-sm tabular-nums text-charcoal">
            {formatPrice(product.price)}
          </p>
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="inline-flex h-11 min-w-11 items-center justify-center gap-2 border border-charcoal/25 px-3 text-[10px] font-medium uppercase tracking-folio text-charcoal transition-colors hover:border-charcoal hover:bg-charcoal hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </article>
  );
}
