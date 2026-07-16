import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products, type ProductCategory } from '../data/products';
import { ProductCard } from '../components/ui/ProductCard';
import { ChevronDown } from 'lucide-react';

const tabs: Array<{ id: 'all' | ProductCategory; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'skin', label: 'Skin' },
  { id: 'body', label: 'Body' },
  { id: 'sun', label: 'Sun' },
  { id: 'fragrance', label: 'Fragrance' },
];

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const queryParam = searchParams.get('q') ?? '';
  const sortParam = searchParams.get('sort');

  const initialTab: 'all' | ProductCategory =
    categoryParam === 'skin' ||
    categoryParam === 'body' ||
    categoryParam === 'sun' ||
    categoryParam === 'fragrance'
      ? categoryParam
      : 'all';

  const [activeTab, setActiveTab] = useState<'all' | ProductCategory>(initialTab);
  const [query, setQuery] = useState(queryParam);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  const filteredProducts = useMemo(() => {
    let list =
      activeTab === 'all'
        ? [...products]
        : products.filter((p) => p.category === activeTab);

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (sortParam === 'new') {
      list = list.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    } else if (sortParam === 'bestsellers') {
      list = list.sort((a, b) => Number(!!b.isBestSeller) - Number(!!a.isBestSeller));
    }

    return list;
  }, [activeTab, query, sortParam]);

  const selectTab = (id: 'all' | ProductCategory) => {
    setActiveTab(id);
    const next = new URLSearchParams(searchParams);
    if (id === 'all') next.delete('category');
    else next.set('category', id);
    setSearchParams(next, { replace: true });
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (query.trim()) next.set('q', query.trim());
    else next.delete('q');
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="flex flex-col bg-ivory">
      <div className="border-b border-charcoal/10 bg-ivory px-5 pb-8 pt-16 sm:px-6 md:px-12 lg:px-24">
        <div className="mx-auto w-full max-w-7xl">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-folio text-brass">
            The Complete Selection
          </p>
          <h1 className="mb-6 font-serif text-5xl leading-none text-charcoal md:text-7xl lg:text-8xl">
            Shop All
          </h1>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <p className="max-w-lg text-sm font-serif italic text-charcoal/70">
              Independent and established beauty — skincare, body, sun, and fragrance —
              curated across brands for how they work in ritual, not in isolation.
            </p>
            <p className="text-[10px] font-medium uppercase tracking-folio text-charcoal/60">
              {filteredProducts.length} Products /{' '}
              {new Set(products.map((p) => p.brand)).size} Brands
            </p>
          </div>

          <form
            onSubmit={onSearchSubmit}
            className="mt-8 flex max-w-md flex-col gap-2 border-b border-charcoal/25 pb-2 sm:flex-row sm:items-end sm:gap-4"
            role="search"
          >
            <label className="flex flex-1 flex-col gap-1.5">
              <span className="text-[11px] uppercase tracking-folio text-charcoal/60">
                Search brands & products
              </span>
              <input
                type="search"
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. COSRX, sunscreen, serum"
                className="w-full bg-transparent py-2 text-sm text-charcoal outline-none placeholder:text-charcoal/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
              />
            </label>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center border border-charcoal bg-charcoal px-5 text-[11px] font-medium uppercase tracking-folio text-ivory transition-colors hover:bg-oxblood hover:border-oxblood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="sticky top-16 z-40 border-b border-charcoal/15 border-t border-charcoal/10 bg-ivory/95 backdrop-blur-sm lg:top-[4.25rem]">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-5 sm:px-6 md:px-12 lg:px-24">
          <div
            className="flex h-full gap-5 overflow-x-auto text-xs font-medium uppercase tracking-folio sm:gap-8"
            role="tablist"
            aria-label="Product categories"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => selectTab(tab.id)}
                className={`h-full shrink-0 border-b-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-charcoal ${
                  activeTab === tab.id
                    ? 'border-charcoal text-charcoal'
                    : 'border-transparent text-charcoal/55 hover:text-charcoal'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="hidden h-full border-l border-charcoal/15 text-[10px] font-medium uppercase tracking-folio md:flex">
            <button
              type="button"
              className="flex h-full min-w-[140px] items-center justify-between gap-2 px-5 hover:bg-charcoal/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-charcoal"
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.set('sort', 'bestsellers');
                setSearchParams(next, { replace: true });
              }}
            >
              Best Sellers <ChevronDown className="h-3 w-3" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-ivory px-5 py-12 sm:px-6 md:px-12 lg:px-24">
        <div className="mx-auto w-full max-w-7xl">
          {filteredProducts.length === 0 ? (
            <p className="font-serif text-lg italic text-charcoal/70">
              No products match your filters. Try another brand or category.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
