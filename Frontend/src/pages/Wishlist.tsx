import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ProductCard } from '../components/ui/ProductCard';
import { Button } from '../components/ui/Button';
import { getProductById } from '../data/productSelectors';
import { useAppStore } from '../store/useAppStore';

export function Wishlist() {
  const { wishlist } = useAppStore();
  const [query, setQuery] = useState('');

  const wishlistedProducts = useMemo(() => {
    const resolved = wishlist
      .map((id) => getProductById(id))
      .filter((product): product is NonNullable<typeof product> => Boolean(product));

    const normalized = query.trim().toLowerCase();
    if (!normalized) return resolved;

    return resolved.filter(
      (product) =>
        product.name.toLowerCase().includes(normalized) ||
        product.brand.toLowerCase().includes(normalized) ||
        product.productType.toLowerCase().includes(normalized),
    );
  }, [wishlist, query]);

  return (
    <div className="min-h-[70vh] bg-ivory px-5 py-16 text-charcoal sm:px-6 md:px-10 lg:px-14">
      <div className="mx-auto flex w-full max-w-editorial flex-col">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 border-b border-charcoal/15 pb-8 md:flex-row md:items-center">
          <h1 className="font-serif text-3xl md:text-4xl">
            My Wishlist{' '}
            <span className="text-2xl italic text-charcoal/55">
              ({wishlistedProducts.length})
            </span>
          </h1>

          <div className="flex w-full items-center border-b border-charcoal/20 pb-2 md:w-64">
            <Search className="mr-2 h-4 w-4 text-charcoal/45" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search wishlist..."
              className="w-full border-none bg-transparent text-sm outline-none placeholder:text-charcoal/40"
              aria-label="Search wishlist"
            />
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="py-24 text-center">
            <p className="mb-6 font-serif text-lg text-charcoal/60">
              Your wishlist is currently empty.
            </p>
            <Link to="/shop">
              <Button>DISCOVER PRODUCTS</Button>
            </Link>
          </div>
        ) : wishlistedProducts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="mb-6 font-serif text-lg text-charcoal/60">
              No saved products match “{query.trim()}”.
            </p>
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-[10px] font-medium uppercase tracking-folio text-oxblood"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {wishlistedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
