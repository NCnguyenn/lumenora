import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { products, type Product } from '../../data/products';
import { formatPrice } from '../../data/products';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = ['Lip oil', 'Body', 'Skincare', 'Serum', 'Cleanser'];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Small delay to ensure render is complete before focus
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Live search logic
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // If no query, show popular products (bestsellers)
      const popular = products.filter(p => p.isBestSeller).slice(0, 5);
      setResults(popular);
      return;
    }

    const filtered = products.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    });
    setResults(filtered);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-ivory/95 p-6 backdrop-blur-md md:p-12"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Header & Input */}
      <div className="flex w-full flex-col items-center gap-8 border-b border-charcoal/15 pb-8 md:flex-row md:justify-between md:gap-4">
        <div className="hidden font-serif text-2xl font-bold tracking-[0.1em] text-charcoal md:block">
          SEARCH
        </div>
        <div className="w-full max-w-2xl flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for?"
            className="w-full border-0 border-b-2 border-charcoal/30 bg-transparent py-2 text-center font-serif text-3xl text-charcoal transition-colors placeholder:text-charcoal/40 focus:border-charcoal focus:outline-none focus:ring-0 md:text-4xl"
          />
        </div>
        <button
          onClick={onClose}
          className="group flex shrink-0 items-center gap-2 text-sm font-semibold uppercase tracking-widest text-charcoal transition-colors hover:text-oxblood"
          aria-label="Close search"
        >
          <span className="hidden md:block">Cancel</span>
          <X className="h-6 w-6 transition-transform group-hover:rotate-90" aria-hidden />
        </button>
      </div>

      {/* Body: Popular Searches & Results */}
      <div className="mx-auto mt-8 flex w-full max-w-7xl flex-col gap-10 md:mt-12 md:flex-row md:gap-16">
        {/* Left Col: Popular tags */}
        <div className="md:w-1/4 md:border-r md:border-charcoal/15 md:pr-10">
          <h3 className="mb-6 text-[11px] font-bold uppercase tracking-[0.15em] text-charcoal/50">
            Popular Searches
          </h3>
          <div className="flex flex-wrap gap-2 md:flex-col md:gap-4">
            {POPULAR_SEARCHES.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="rounded-full bg-charcoal/5 px-4 py-1.5 text-sm font-medium text-charcoal transition-colors hover:bg-charcoal/10 hover:text-oxblood md:rounded-none md:bg-transparent md:px-0 md:py-0 md:text-left"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Right Col: Results */}
        <div className="flex-1">
          <h3 className="mb-6 text-[11px] font-bold uppercase tracking-[0.15em] text-charcoal/50">
            {query.trim()
              ? `Search Results (${results.length})`
              : 'Popular Products'}
          </h3>
          
          {results.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:gap-x-6 lg:grid-cols-4 xl:grid-cols-5">
              {results.map((product) => (
                <Link
                  key={product.id}
                  to={`/shop?category=${product.category}`}
                  onClick={onClose}
                  className="group block text-charcoal decoration-transparent"
                >
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-sm border border-charcoal/10 bg-white">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/generated/product-serum.png';
                      }}
                    />
                  </div>
                  <h4 className="truncate font-serif text-[13px] font-bold">
                    {product.name}
                  </h4>
                  <p className="mt-0.5 text-[12px] text-charcoal/70">
                    {formatPrice(product.price)}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-lg italic text-charcoal/50">
              No products found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
