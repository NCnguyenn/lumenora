import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { products, type ProductCategory } from '../data/products';
import { ProductCard } from '../components/ui/ProductCard';

const tabs: Array<{ id: 'all' | ProductCategory; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'skin', label: 'Skin' },
  { id: 'body', label: 'Body' },
  { id: 'sun', label: 'Sun' },
  { id: 'fragrance', label: 'Fragrance' },
];

const priceOptions = [
  { value: '', label: 'Any price' },
  { value: '25', label: 'Under $25' },
  { value: '50', label: 'Under $50' },
  { value: '100', label: 'Under $100' },
];

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'new', label: 'New arrivals' },
  { value: 'bestsellers', label: 'Bestsellers' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
];

const brandOptions = [...new Set(products.map((product) => product.brand))].sort();

function parsePriceParam(value: string | null) {
  if (!value) return '';
  const parsed = Number(value);
  const normalized = Number.isFinite(parsed) && parsed > 0 ? String(parsed) : '';
  return priceOptions.some((option) => option.value === normalized) ? normalized : '';
}

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const queryParam = searchParams.get('q') ?? '';
  const rawSortParam = searchParams.get('sort') ?? 'featured';
  const sortParam = sortOptions.some((option) => option.value === rawSortParam)
    ? rawSortParam
    : 'featured';
  const rawBrandParam = searchParams.get('brand') ?? '';
  const brandParam = brandOptions.includes(rawBrandParam) ? rawBrandParam : '';
  const priceParam = parsePriceParam(searchParams.get('maxPrice'));

  const initialTab: 'all' | ProductCategory =
    categoryParam === 'skin' ||
    categoryParam === 'body' ||
    categoryParam === 'sun' ||
    categoryParam === 'fragrance'
      ? categoryParam
      : 'all';

  const [activeTab, setActiveTab] = useState<'all' | ProductCategory>(initialTab);
  const [draftCategory, setDraftCategory] = useState<'all' | ProductCategory>(initialTab);
  const [query, setQuery] = useState(queryParam);
  const [brandFilter, setBrandFilter] = useState(brandParam);
  const [priceMax, setPriceMax] = useState(priceParam);
  const [draftBrand, setDraftBrand] = useState(brandParam);
  const [draftPriceMax, setDraftPriceMax] = useState(priceParam);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setActiveTab(initialTab);
    setDraftCategory(initialTab);
    setQuery(queryParam);
    setBrandFilter(brandParam);
    setPriceMax(priceParam);
    setDraftBrand(brandParam);
    setDraftPriceMax(priceParam);
  }, [brandParam, initialTab, priceParam, queryParam]);

  useEffect(() => {
    if (isFilterOpen) filterHeadingRef.current?.focus();
  }, [isFilterOpen]);

  const filteredProducts = useMemo(() => {
    let list = activeTab === 'all'
      ? [...products]
      : products.filter((product) => product.category === activeTab);

    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery) {
      list = list.filter(
        (product) =>
          product.name.toLowerCase().includes(normalizedQuery) ||
          product.brand.toLowerCase().includes(normalizedQuery) ||
          product.category.toLowerCase().includes(normalizedQuery),
      );
    }

    if (brandFilter) {
      list = list.filter((product) => product.brand === brandFilter);
    }

    if (priceMax) {
      list = list.filter((product) => product.price < Number(priceMax));
    }

    if (sortParam === 'new') {
      list.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    } else if (sortParam === 'bestsellers') {
      list.sort((a, b) => Number(!!b.isBestSeller) - Number(!!a.isBestSeller));
    } else if (sortParam === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortParam === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [activeTab, brandFilter, priceMax, query, sortParam]);

  const updateParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next, { replace: true });
  };

  const selectTab = (id: 'all' | ProductCategory) => {
    setActiveTab(id);
    updateParams({ category: id === 'all' ? null : id });
  };

  const applyFilters = () => {
    setActiveTab(draftCategory);
    setBrandFilter(draftBrand);
    setPriceMax(draftPriceMax);
    updateParams({
      category: draftCategory === 'all' ? null : draftCategory,
      brand: draftBrand || null,
      maxPrice: draftPriceMax || null,
    });
    setIsFilterOpen(false);
    queueMicrotask(() => filterButtonRef.current?.focus());
  };

  const closeFilters = () => {
    setDraftCategory(activeTab);
    setDraftBrand(brandFilter);
    setDraftPriceMax(priceMax);
    setIsFilterOpen(false);
    queueMicrotask(() => filterButtonRef.current?.focus());
  };

  const clearFilters = () => {
    setBrandFilter('');
    setPriceMax('');
    setDraftBrand('');
    setDraftPriceMax('');
    setDraftCategory('all');
    setQuery('');
    updateParams({ category: null, brand: null, maxPrice: null, q: null });
    setActiveTab('all');
  };

  const removeFilter = (key: 'brand' | 'maxPrice' | 'q') => {
    if (key === 'brand') {
      setBrandFilter('');
      setDraftBrand('');
    }
    if (key === 'maxPrice') {
      setPriceMax('');
      setDraftPriceMax('');
    }
    if (key === 'q') setQuery('');
    updateParams({ [key]: null });
  };

  const onSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateParams({ q: query.trim() || null });
  };

  const activePriceLabel = priceOptions.find((option) => option.value === priceMax)?.label;

  return (
    <div className="flex flex-col bg-ivory text-charcoal">
      <section className="border-b border-charcoal/10 bg-ivory">
        <div className="mx-auto grid min-h-[30rem] max-w-editorial grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col justify-center px-5 py-14 sm:px-6 md:px-10 lg:px-14">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-folio text-brass">
              The Complete Selection
            </p>
            <h1 className="font-serif text-5xl leading-none tracking-tight text-charcoal md:text-7xl">
              Shop All
            </h1>
            <p className="mt-7 max-w-md font-serif text-base italic leading-relaxed text-charcoal/75 md:text-lg">
              Independent and established beauty — skincare, body, sun, and fragrance —
              curated across brands for how they work in ritual, not in isolation.
            </p>
            <p className="mt-8 text-[10px] font-medium uppercase tracking-folio text-charcoal/65">
              {filteredProducts.length} Products&nbsp; / &nbsp;
              {new Set(filteredProducts.map((product) => product.brand)).size} Brands
            </p>
            <form onSubmit={onSearchSubmit} role="search" className="sr-only">
              <label htmlFor="shop-search">Search products</label>
              <input id="shop-search" value={query} onChange={(event) => setQuery(event.target.value)} />
              <button type="submit">Search</button>
            </form>
          </div>
          <div className="min-h-[18rem] overflow-hidden bg-parchment md:min-h-0">
            <img
              src="/assets/generated/home-daily-edit.jpg"
              alt="Skincare still life with amber bottles, olive leaves, and linen"
              className="h-full w-full object-cover"
              width={1200}
              height={900}
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      <section className="sticky top-16 z-40 border-b border-charcoal/15 border-t border-charcoal/10 bg-ivory/95 backdrop-blur-sm lg:top-[4.25rem]">
        <div className="mx-auto flex min-h-16 max-w-editorial flex-wrap items-center gap-4 px-5 py-2 sm:px-6 md:px-10 lg:px-14">
          <div
            className="flex min-h-12 flex-1 gap-5 overflow-x-auto text-[11px] font-medium uppercase tracking-folio sm:gap-8"
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
                className={`min-h-12 shrink-0 border-b-2 px-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-charcoal ${
                  activeTab === tab.id
                    ? 'border-olive bg-olive text-ivory'
                    : 'border-transparent text-charcoal/60 hover:text-charcoal'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex min-h-12 shrink-0 items-center gap-3 text-[10px] font-medium uppercase tracking-folio text-charcoal/70">
            <button
              ref={filterButtonRef}
              type="button"
              aria-expanded={isFilterOpen}
              aria-controls="shop-filters"
              aria-label="Open filters"
              onClick={() => {
                setDraftBrand(brandFilter);
                setDraftPriceMax(priceMax);
                setDraftCategory(activeTab);
                setIsFilterOpen((open) => !open);
              }}
              className="inline-flex min-h-11 items-center gap-2 border border-charcoal/60 px-4 text-charcoal transition-colors hover:border-charcoal hover:bg-charcoal hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              All filters
            </button>
            <span className="hidden border-l border-charcoal/20 pl-4 sm:inline">
              {filteredProducts.length} products
            </span>
            <label className="flex min-h-11 items-center border-l border-charcoal/20 pl-3 sm:pl-4">
              <span className="sr-only">Sort products</span>
              <select
                aria-label="Sort products"
                value={sortOptions.some((option) => option.value === sortParam) ? sortParam : 'featured'}
                onChange={(event) => updateParams({ sort: event.target.value === 'featured' ? null : event.target.value })}
                className="min-h-11 bg-transparent pr-5 text-[10px] font-medium uppercase tracking-folio text-charcoal outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    Sort: {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      {isFilterOpen && (
        <section
          id="shop-filters"
          role="dialog"
          aria-modal="false"
          aria-labelledby="shop-filter-title"
          className="border-b border-charcoal/15 bg-parchment"
        >
          <div className="mx-auto max-w-editorial px-5 py-6 sm:px-6 md:px-10 lg:px-14">
            <div className="flex items-center justify-between gap-4">
              <h2
                ref={filterHeadingRef}
                id="shop-filter-title"
                tabIndex={-1}
                className="font-serif text-2xl text-charcoal outline-none"
              >
                Product filters
              </h2>
              <button
                type="button"
                aria-label="Close filters"
                onClick={closeFilters}
                className="inline-flex h-11 w-11 items-center justify-center text-charcoal transition-colors hover:text-oxblood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <label className="flex flex-col gap-2 text-[10px] font-medium uppercase tracking-folio text-charcoal/65">
                Category
                <select
                  aria-label="Category"
                  value={draftCategory}
                  onChange={(event) => setDraftCategory(event.target.value as 'all' | ProductCategory)}
                  className="min-h-12 border-b border-charcoal/30 bg-transparent text-sm normal-case tracking-normal text-charcoal outline-none focus:border-charcoal"
                >
                  {tabs.map((tab) => <option key={tab.id} value={tab.id}>{tab.label}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-[10px] font-medium uppercase tracking-folio text-charcoal/65">
                Brand
                <select
                  aria-label="Brand"
                  value={draftBrand}
                  onChange={(event) => setDraftBrand(event.target.value)}
                  className="min-h-12 border-b border-charcoal/30 bg-transparent text-sm normal-case tracking-normal text-charcoal outline-none focus:border-charcoal"
                >
                  <option value="">All brands</option>
                  {brandOptions.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-[10px] font-medium uppercase tracking-folio text-charcoal/65">
                Price
                <select
                  aria-label="Price"
                  value={draftPriceMax}
                  onChange={(event) => setDraftPriceMax(event.target.value)}
                  className="min-h-12 border-b border-charcoal/30 bg-transparent text-sm normal-case tracking-normal text-charcoal outline-none focus:border-charcoal"
                >
                  {priceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={clearFilters} className="min-h-11 border border-charcoal/35 px-5 text-[10px] font-medium uppercase tracking-folio text-charcoal hover:border-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal">
                Clear all
              </button>
              <button type="button" onClick={applyFilters} className="min-h-11 bg-charcoal px-6 text-[10px] font-medium uppercase tracking-folio text-ivory hover:bg-oxblood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal">
                Apply filters
              </button>
            </div>
          </div>
        </section>
      )}

      {(brandFilter || priceMax || queryParam) && (
        <div className="mx-auto flex w-full max-w-editorial flex-wrap gap-2 px-5 pt-5 sm:px-6 md:px-10 lg:px-14">
          {brandFilter && (
            <button type="button" onClick={() => removeFilter('brand')} aria-label={`Remove filter Brand: ${brandFilter}`} className="inline-flex min-h-9 items-center gap-2 border border-olive/50 bg-olive/10 px-3 text-[10px] font-medium uppercase tracking-folio text-charcoal hover:bg-olive/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal">
              Brand: {brandFilter}<X className="h-3 w-3" aria-hidden />
            </button>
          )}
          {priceMax && activePriceLabel && (
            <button type="button" onClick={() => removeFilter('maxPrice')} aria-label={`Remove filter ${activePriceLabel}`} className="inline-flex min-h-9 items-center gap-2 border border-olive/50 bg-olive/10 px-3 text-[10px] font-medium uppercase tracking-folio text-charcoal hover:bg-olive/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal">
              {activePriceLabel}<X className="h-3 w-3" aria-hidden />
            </button>
          )}
          {queryParam && (
            <button type="button" onClick={() => removeFilter('q')} aria-label={`Remove filter Search: ${queryParam}`} className="inline-flex min-h-9 items-center gap-2 border border-olive/50 bg-olive/10 px-3 text-[10px] font-medium uppercase tracking-folio text-charcoal hover:bg-olive/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal">
              Search: {queryParam}<X className="h-3 w-3" aria-hidden />
            </button>
          )}
        </div>
      )}

      <section className="bg-ivory px-5 py-10 sm:px-6 md:px-10 md:py-14 lg:px-14">
        <div className="mx-auto w-full max-w-editorial">
          {filteredProducts.length === 0 ? (
            <div className="border-t border-charcoal/15 py-16">
              <p className="font-serif text-2xl italic text-charcoal/70">No products match your filters.</p>
              <button type="button" onClick={clearFilters} className="mt-6 min-h-11 border border-charcoal px-5 text-[10px] font-medium uppercase tracking-folio text-charcoal hover:bg-charcoal hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7">
              {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-charcoal/10 bg-olive text-ivory">
        <div className="mx-auto grid max-w-editorial items-stretch md:grid-cols-2">
          <div className="flex flex-col justify-center px-5 py-14 sm:px-6 md:px-10 lg:px-14">
            <p className="mb-4 text-[10px] font-medium uppercase tracking-folio text-ivory/60">The Lumenora Edit</p>
            <h2 className="font-serif text-3xl leading-tight md:text-4xl">Thoughtful rituals for radiant skin.</h2>
            <p className="mt-5 max-w-md font-serif text-base italic leading-relaxed text-ivory/75">A considered edit of formulas from independent and established houses, chosen to work beautifully together.</p>
            <Link to="/shop?sort=bestsellers" className="mt-8 inline-flex min-h-11 w-fit items-center justify-center border border-ivory/70 px-6 text-[10px] font-medium uppercase tracking-folio text-ivory transition-colors hover:bg-ivory hover:text-olive focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory">
              Explore the edit
            </Link>
          </div>
          <div className="min-h-[16rem] overflow-hidden bg-parchment">
            <img src="/assets/generated/home-brand-interlude.jpg" alt="Botanical skincare ritual still life" className="h-full w-full object-cover" width={1200} height={800} loading="lazy" />
          </div>
        </div>
      </section>
    </div>
  );
}
