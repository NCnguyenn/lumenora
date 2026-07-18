import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import type { Product } from '../../data/types';
import {
  formatPrice,
  getPrimaryImage,
  searchProducts,
} from '../../data/productSelectors';
import { products } from '../../data/products';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Tags that map to real catalog coverage — no fictional SKUs (e.g. Lip oil). */
const POPULAR_SEARCHES = [
  'Serum',
  'Cleanser',
  'Body',
  'Sunscreen',
  'Fragrance',
] as const;

function getPopularProducts(limit = 5): Product[] {
  const bestsellers = products.filter((product) =>
    product.badges.includes('bestseller'),
  );
  if (bestsellers.length >= limit) return bestsellers.slice(0, limit);
  return products
    .slice()
    .sort(
      (a, b) =>
        b.rating.value - a.rating.value ||
        b.rating.count - a.rating.count ||
        a.name.localeCompare(b.name),
    )
    .slice(0, limit);
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = window.setTimeout(() => inputRef.current?.focus(), 100);
      return () => {
        window.clearTimeout(timer);
        document.body.style.overflow = '';
      };
    }

    document.body.style.overflow = '';
    setQuery('');
    setResults([]);
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const normalized = query.trim();
    if (!normalized) {
      setResults(getPopularProducts(5));
      return;
    }
    setResults(searchProducts(normalized).slice(0, 20));
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-ivory/95 p-6 backdrop-blur-md md:p-12"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex w-full flex-col items-center gap-8 border-b border-charcoal/15 pb-8 md:flex-row md:justify-between md:gap-4">
        <div className="hidden font-serif text-2xl font-bold tracking-[0.1em] text-charcoal md:block">
          SEARCH
        </div>
        <div className="w-full max-w-2xl flex-1">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="What are you looking for?"
            className="w-full border-0 border-b-2 border-charcoal/30 bg-transparent py-2 text-center font-serif text-3xl text-charcoal transition-colors placeholder:text-charcoal/40 focus:border-charcoal focus:outline-none focus:ring-0 md:text-4xl"
          />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="group flex shrink-0 items-center gap-2 text-sm font-semibold uppercase tracking-widest text-charcoal transition-colors hover:text-oxblood"
          aria-label="Close search"
        >
          <span className="hidden md:block">Cancel</span>
          <X className="h-6 w-6 transition-transform group-hover:rotate-90" aria-hidden />
        </button>
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-7xl flex-col gap-10 md:mt-12 md:flex-row md:gap-16">
        <div className="md:w-1/4 md:border-r md:border-charcoal/15 md:pr-10">
          <h3 className="mb-6 text-[11px] font-bold uppercase tracking-[0.15em] text-charcoal/50">
            Popular Searches
          </h3>
          <div className="flex flex-wrap gap-2 md:flex-col md:gap-4">
            {POPULAR_SEARCHES.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setQuery(tag)}
                className="rounded-full bg-charcoal/5 px-4 py-1.5 text-sm font-medium text-charcoal transition-colors hover:bg-charcoal/10 hover:text-oxblood md:rounded-none md:bg-transparent md:px-0 md:py-0 md:text-left"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <h3 className="mb-6 text-[11px] font-bold uppercase tracking-[0.15em] text-charcoal/50">
            {query.trim()
              ? `Search Results (${results.length})`
              : 'Popular Products'}
          </h3>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:gap-x-6 lg:grid-cols-4 xl:grid-cols-5">
              {results.map((product) => {
                const image = getPrimaryImage(product);
                return (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    onClick={onClose}
                    className="group block text-charcoal decoration-transparent"
                  >
                    <div className="relative mb-3 aspect-square overflow-hidden border border-charcoal/10 bg-parchment">
                      <img
                        src={image?.src ?? product.image}
                        alt={image?.alt ?? `${product.brand} — ${product.name}`}
                        width={image?.width ?? 480}
                        height={image?.height ?? 480}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-[10px] font-medium uppercase tracking-folio text-brass">
                      {product.brand}
                    </p>
                    <h4 className="mt-0.5 truncate font-serif text-[13px] font-bold">
                      {product.name}
                    </h4>
                    <p className="mt-0.5 text-[12px] tabular-nums text-charcoal/70">
                      {formatPrice(product.price)}
                    </p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center font-serif text-lg italic text-charcoal/50">
              No products found for “{query}”
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
