import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Pause,
  Play,
  ShoppingBag,
} from 'lucide-react';
import {
  useState,
  useEffect,
  useMemo,
  type FormEvent,
  type ImgHTMLAttributes,
} from 'react';
import {
  products,
  findProductByName,
  formatPrice,
  categoryLabel,
  type Product,
} from '../data/products';
import { articles } from '../data/articles';
import { useAppStore } from '../store/useAppStore';
import { ProductCard } from '../components/ui/ProductCard';
import { cn } from '../lib/utils';

/** Prefer art-directed editorial JPGs; fall back to existing generated PNGs if not copied yet. */
function EditorialImg({
  src,
  fallback,
  alt,
  className,
  loading = 'lazy',
  width,
  height,
  ...rest
}: ImgHTMLAttributes<HTMLImageElement> & { fallback: string }) {
  const [current, setCurrent] = useState(src);
  useEffect(() => {
    setCurrent(src);
  }, [src]);
  return (
    <img
      {...rest}
      src={current}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      className={className}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
}

const heroSlides = [
  {
    id: 1,
    imageSrc: '/assets/generated/hero-marketplace-1920.jpg',
    imageSrcSet:
      '/assets/generated/hero-marketplace-768.jpg 768w, /assets/generated/hero-marketplace-1280.jpg 1280w, /assets/generated/hero-marketplace-1920.jpg 1920w, /assets/generated/hero-marketplace-3840.jpg 3840w',
    imageSizes: '100vw',
    subtitle: 'The Curated Edit',
    title: 'Less routine.\nMore ritual.',
    description:
      'A multi-brand beauty marketplace — skincare, body, sun, and fragrance selected with intention.',
    cta: 'Shop the Edit',
    ctaTo: '/shop',
  },
  {
    id: 2,
    imageSrc: '/assets/generated/hero-3.png',
    imageSrcSet: undefined,
    imageSizes: undefined,
    subtitle: 'New Arrivals',
    title: "Nature's\nFinest.",
    description:
      'Discover new formulas from independent and established houses across our shelves.',
    cta: 'Discover New Arrivals',
    ctaTo: '/shop?sort=new',
  },
  {
    id: 3,
    imageSrc: '/assets/generated/home-composition-serum.jpg',
    imageSrcSet: undefined,
    imageSizes: undefined,
    subtitle: 'Bestsellers',
    title: 'Radiance\nRestored.',
    description:
      "The community's most-loved essentials — from many brands, one considered edit.",
    cta: 'Shop Bestsellers',
    ctaTo: '/shop?sort=bestsellers',
  },
];

const categories = [
  {
    name: 'Skin',
    href: '/shop?category=skin',
    cta: 'Explore Skincare',
    copy: 'Serums, creams, and cleansers from houses that treat the barrier with care.',
    image: '/assets/generated/home-contents-skin.jpg',
    fallback: '/assets/generated/product-serum.png',
    alt: 'Curated skincare still-life',
    aspect: 'aspect-[4/5]',
    className: 'lg:col-span-5',
  },
  {
    name: 'Body',
    href: '/shop?category=body',
    cta: 'Explore Body',
    copy: 'Nourishing textures for after the bath — oils, butters, and cleansers.',
    image: '/assets/generated/home-contents-body.jpg',
    fallback: '/assets/generated/home-feature-lotion.png',
    alt: 'Body care cream texture',
    aspect: 'aspect-[4/3]',
    className: 'md:mt-10 lg:col-span-4 lg:mt-16',
  },
  {
    name: 'Sun',
    href: '/shop?category=sun',
    cta: 'Explore Sun Care',
    copy: 'Daily protection that disappears into ritual, not into compromise.',
    image: '/assets/generated/home-contents-sun.jpg',
    fallback: '/assets/generated/product-sunscreen.png',
    alt: 'Sun care with foliage',
    aspect: 'aspect-[3/4]',
    className: 'md:col-start-2 lg:col-span-3 lg:col-start-auto lg:mt-28',
  },
  {
    name: 'Fragrance',
    href: '/shop?category=fragrance',
    cta: 'Explore Fragrance',
    copy: 'Quiet scents for skin and linen — layered notes, never noise.',
    image: '/assets/generated/home-brand-interlude.jpg',
    fallback: '/assets/generated/home-composition-sunscreen.jpg',
    alt: 'Fragrance and botanical mineral texture',
    aspect: 'aspect-[4/3]',
    className: 'md:col-span-2 lg:col-span-12 lg:mt-6 lg:max-w-md lg:ml-auto',
  },
] as const;

const dailyEditNames = [
  'Bamboo Ultra Hydrating Toner',
  'Birch Moisturizing Soothing Gel',
  'Mugwort Calming Cream',
] as const;

const compositions = [
  {
    name: 'Advanced Snail Mucin 96% Power Repairing Essence Serum',
    descriptor: 'Viscous repair for depleted skin — a cult formula, curated for ritual.',
    image: '/assets/generated/home-composition-serum.jpg',
    fallback: '/assets/generated/product-serum.png',
  },
  {
    name: 'Volcanic Sea Clay Detox Masque',
    descriptor: 'Mineral depth. Quiet clarity.',
    image: '/assets/generated/home-composition-mask.jpg',
    fallback: '/assets/generated/product-mask.png',
  },
  {
    name: 'Invisible Fluid Sunscreen SPF 50+ PA++++',
    descriptor: 'Sheer protection that disappears into the day.',
    image: '/assets/generated/home-composition-sunscreen.jpg',
    fallback: '/assets/generated/product-sunscreen.png',
  },
];

const ritualScenes = [
  {
    label: 'CLEANSE',
    copy: 'Begin with water and intention. Formulas from multiple houses that lift without stripping the barrier.',
    image: '/assets/generated/home-ritual-cleanse.jpg',
    fallback: '/assets/generated/product-cleanser.png',
    imageFirst: true,
    products: ['Green Tea Deep Cleansing', 'Eucalyptus Nourishing Body Cleanser'],
  },
  {
    label: 'TREAT',
    copy: 'Layer actives with restraint. Essence and cream working in quiet sequence across brands.',
    image: '/assets/generated/home-ritual-treat.jpg',
    fallback: '/assets/generated/product-serum.png',
    imageFirst: false,
    products: [
      'Advanced Snail Mucin 96% Power Repairing Essence Serum',
      'Mugwort Calming Cream',
    ],
  },
  {
    label: 'PROTECT',
    copy: 'Seal the day. Fluid sun care and body nourishment as one continuous gesture.',
    image: '/assets/generated/home-ritual-protect.jpg',
    fallback: '/assets/generated/product-sunscreen.png',
    imageFirst: true,
    products: [
      'Invisible Fluid Sunscreen SPF 50+ PA++++',
      'Body Lotion Lavender Patchouli',
    ],
  },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

function ProductLineItem({ product }: { product: Product }) {
  const { wishlist, toggleWishlist, addToCart } = useAppStore();
  const wishlisted = wishlist.includes(product.id);

  return (
    <li className="border-b border-charcoal/20">
      <div className="flex items-start gap-3 py-4 sm:items-center sm:gap-4">
        <Link
          to={`/shop?category=${product.category}`}
          className="min-w-0 flex-1 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
        >
          <p className="text-[10px] font-medium uppercase tracking-folio text-brass">
            {product.brand}
          </p>
          <p className="mt-1 font-serif text-[15px] leading-snug text-charcoal transition-colors group-hover:text-oxblood">
            {product.name}
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-wider text-charcoal/55">
            {categoryLabel(product.category)}
          </p>
        </Link>
        <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-1">
          <span className="text-[12px] tabular-nums tracking-wide text-charcoal/75">
            {formatPrice(product.price)}
          </span>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className="inline-flex h-11 w-11 items-center justify-center text-charcoal transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
              aria-label={
                wishlisted
                  ? `Remove ${product.name} from wishlist`
                  : `Add ${product.name} to wishlist`
              }
              aria-pressed={wishlisted}
            >
              <Heart
                className={cn('h-4 w-4', wishlisted && 'fill-oxblood text-oxblood')}
                aria-hidden
              />
            </button>
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="inline-flex h-11 w-11 items-center justify-center text-charcoal transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

export function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  const autoplay = !isPaused && !prefersReducedMotion;

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [autoplay]);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const primaryArticle =
    articles.find(
      (a) =>
        a.title === "Why Snail Mucin is the Skincare Ingredient You Can't Ignore"
    ) ?? articles[0];
  const supportArticles = [
    articles.find((a) => a.title === 'The Ultimate Guide to Double Cleansing'),
    articles.find((a) => a.title === 'How to Repair a Damaged Skin Barrier'),
  ].filter(Boolean) as typeof articles;

  const dailyEdit = useMemo(
    () =>
      dailyEditNames
        .map((name) => findProductByName(name))
        .filter(Boolean) as Product[],
    []
  );

  const bestsellers = useMemo(
    () =>
      products
        .filter((p) => p.isBestSeller || p.isNew)
        .slice(0, 4),
    []
  );

  const onNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setNewsletterStatus('error');
      setNewsletterMessage('Please enter a valid email address.');
      return;
    }
    setNewsletterStatus('loading');
    setNewsletterMessage('');
    window.setTimeout(() => {
      setNewsletterStatus('success');
      setNewsletterMessage('You are on the list. Welcome to The Edit.');
      setEmail('');
    }, 700);
  };

  return (
    <div className="flex flex-col overflow-x-hidden bg-ivory text-charcoal">
      {/* ── Hero ── */}
      <section
        aria-label="Seasonal skincare edits"
        aria-roledescription="carousel"
        className="group relative h-[min(92vh,880px)] min-h-[520px] w-full overflow-hidden bg-charcoal md:min-h-[600px]"
      >
        {heroSlides.map((slide, index) => {
          const active = index === currentSlide;
          return (
            <div
              key={slide.id}
              role="group"
              aria-label={`${index + 1} of ${heroSlides.length}`}
              aria-roledescription="slide"
              aria-hidden={!active}
              inert={active ? undefined : true}
              className={cn(
                'absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out',
                active ? 'z-10 opacity-100' : 'z-0 opacity-0',
                prefersReducedMotion && 'transition-none'
              )}
            >
              <div
                className="absolute inset-0 z-10 bg-gradient-to-b from-charcoal/55 via-charcoal/35 to-charcoal/50"
                aria-hidden
              />
              <img
                src={slide.imageSrc}
                srcSet={slide.imageSrcSet}
                sizes={slide.imageSizes}
                alt=""
                width={1920}
                height={1080}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding={index === 0 ? 'sync' : 'async'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                className={cn(
                  'hero-ken-burns h-full w-full object-cover',
                  active && !prefersReducedMotion && 'is-active'
                )}
              />
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 pb-16 pt-10 text-center text-white sm:px-10">
                <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.25em] text-white/85 md:mb-6 md:text-xs">
                  {slide.subtitle}
                </p>
                {active ? (
                  <h1 className="mb-6 max-w-4xl whitespace-pre-line font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl md:mb-8 md:text-7xl lg:text-[6.5rem]">
                    {slide.title}
                  </h1>
                ) : (
                  <p className="mb-6 max-w-4xl whitespace-pre-line font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl md:mb-8 md:text-7xl lg:text-[6.5rem]">
                    {slide.title}
                  </p>
                )}
                <p className="mx-auto mb-8 max-w-md font-serif text-sm text-white/90 md:mb-10 md:text-base">
                  {slide.description}
                </p>
                {active && (
                  <Link to={slide.ctaTo} className="cta-ghost-light">
                    {slide.cta}
                  </Link>
                )}
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-2 top-[42%] z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-md transition-all hover:bg-black/45 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:left-6 md:top-1/2 md:-translate-y-1/2 md:opacity-0 md:group-hover:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" aria-hidden />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-2 top-[42%] z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-md transition-all hover:bg-black/45 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:right-6 md:top-1/2 md:-translate-y-1/2 md:opacity-0 md:group-hover:opacity-100"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" aria-hidden />
        </button>

        <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 md:bottom-8">
          {heroSlides.map((_, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className="inline-flex h-11 w-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === currentSlide ? 'true' : undefined}
            >
              <span
                className={cn(
                  'block h-0.5 transition-all duration-500',
                  idx === currentSlide ? 'w-10 bg-white' : 'w-6 bg-white/45'
                )}
                aria-hidden
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsPaused((paused) => !paused)}
          aria-label={isPaused || prefersReducedMotion ? 'Play slideshow' : 'Pause slideshow'}
          className="absolute bottom-5 right-4 z-30 inline-flex h-11 w-11 items-center justify-center border border-white/40 bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:bottom-7 md:right-8"
        >
          {isPaused || prefersReducedMotion ? (
            <Play className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <Pause className="h-3.5 w-3.5" aria-hidden />
          )}
        </button>
      </section>

      {/* ── Categories ── */}
      <section id="home-categories" className="border-b border-charcoal/10 bg-ivory">
        <div className="mx-auto max-w-editorial px-5 py-16 sm:px-6 md:px-10 md:py-24 lg:px-14 lg:py-28">
          <div className="editorial-reveal mb-12 max-w-2xl md:mb-16">
            <p className="text-[11px] font-medium uppercase tracking-folio text-brass">
              Shop by collection
            </p>
            <p className="mt-4 font-serif text-base italic leading-relaxed text-charcoal/75 md:text-lg">
              Skin, body, sun, and fragrance — assembled as a considered daily edit across
              many brands, rather than a catalogue of one house.
            </p>
          </div>

          <div
            data-layout="home-categories"
            className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-8 lg:grid-cols-12 lg:gap-7 xl:gap-10"
          >
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.href}
                className={cn(
                  'editorial-reveal group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-charcoal',
                  cat.className
                )}
              >
                <figure>
                  <div className={cn('overflow-hidden bg-parchment', cat.aspect)}>
                    <EditorialImg
                      src={cat.image}
                      fallback={cat.fallback}
                      alt={cat.alt}
                      width={800}
                      height={1000}
                      className="editorial-image h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-5 border-t border-charcoal/20 pt-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="font-serif text-2xl text-charcoal">{cat.name}</h2>
                      <span className="editorial-link text-[11px] uppercase tracking-folio text-charcoal/75">
                        {cat.cta}
                      </span>
                    </div>
                    <p className="mt-2 font-serif text-[15px] text-charcoal/75">{cat.copy}</p>
                  </figcaption>
                </figure>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Daily Edit ── */}
      <section className="border-b border-charcoal/10 bg-parchment">
        <div className="mx-auto max-w-editorial px-5 py-16 sm:px-6 md:px-10 md:py-24 lg:px-14 lg:py-28">
          <div className="editorial-reveal grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              <div className="aspect-[4/3] overflow-hidden bg-ivory">
                <EditorialImg
                  src="/assets/generated/home-daily-edit.jpg"
                  fallback="/assets/generated/home-hero.png"
                  alt="Daily edit still-life on wet limestone"
                  width={1200}
                  height={900}
                  className="editorial-image h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-4 lg:pt-2">
              <p className="mb-3 text-[11px] uppercase tracking-folio text-brass">
                The Daily Edit
              </p>
              <h2 className="font-serif text-2xl text-charcoal md:text-3xl">
                Morning sequence
              </h2>
              <p className="mb-8 mt-4 max-w-md font-serif text-base leading-relaxed text-charcoal/80">
                Three formulas from different brands for the morning sequence — toner, gel,
                cream — chosen for quiet hydration rather than spectacle.
              </p>

              <ul className="border-t border-charcoal/20">
                {dailyEdit.map((product) => (
                  <ProductLineItem key={product.id} product={product} />
                ))}
              </ul>

              <Link to="/shop?category=skin" className="cta-text mt-8">
                Explore Skincare
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Compositions ── */}
      <section id="home-compositions" className="border-b border-charcoal/10 bg-ivory">
        <div className="mx-auto max-w-editorial space-y-14 px-5 py-16 sm:px-6 md:space-y-20 md:px-10 md:py-24 lg:px-14 lg:py-28">
          <div className="editorial-reveal max-w-xl">
            <h2 className="font-serif text-3xl leading-tight text-charcoal md:text-4xl">
              Compositions for the Skin
            </h2>
            <p className="mt-4 font-serif text-base italic leading-relaxed text-charcoal/75">
              Curated still-lifes from our multi-brand shelves — each formula given its own
              frame, each house credited.
            </p>
          </div>

          {(() => {
            const item = compositions[0];
            const product = findProductByName(item.name);
            return (
              <figure className="editorial-reveal group w-full">
                <div className="aspect-[16/10] overflow-hidden bg-parchment md:aspect-[21/8]">
                  <EditorialImg
                    src={item.image}
                    fallback={item.fallback}
                    alt={item.name}
                    width={1600}
                    height={700}
                    className="editorial-image h-full w-full object-cover"
                  />
                </div>
                <figcaption className="mt-5 flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    {product && (
                      <p className="text-[10px] font-medium uppercase tracking-folio text-brass">
                        {product.brand}
                      </p>
                    )}
                    <Link
                      to={product ? `/shop?category=${product.category}` : '/shop'}
                      className="mt-1 block font-serif text-lg text-charcoal transition-colors hover:text-oxblood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal md:text-xl"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 font-serif text-sm italic text-charcoal/75">
                      {item.descriptor}
                    </p>
                  </div>
                  {product && (
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-[13px] tabular-nums tracking-wide text-charcoal/80">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  )}
                </figcaption>
              </figure>
            );
          })()}

          <div
            data-layout="home-compositions"
            className="grid grid-cols-1 items-start gap-14 md:grid-cols-12 md:gap-8 lg:gap-12"
          >
            {compositions.slice(1).map((item, i) => {
              const product = findProductByName(item.name);
              return (
                <figure
                  key={item.name}
                  className={cn(
                    'editorial-reveal group',
                    i === 0 ? 'md:col-span-5' : 'md:col-span-6 md:col-start-7 md:mt-12'
                  )}
                >
                  <div className="aspect-square overflow-hidden bg-parchment">
                    <EditorialImg
                      src={item.image}
                      fallback={item.fallback}
                      alt={item.name}
                      width={900}
                      height={900}
                      className="editorial-image h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-5 space-y-1 border-t border-charcoal/20 pt-4">
                    {product && (
                      <p className="text-[10px] font-medium uppercase tracking-folio text-brass">
                        {product.brand}
                      </p>
                    )}
                    <Link
                      to={product ? `/shop?category=${product.category}` : '/shop'}
                      className="block font-serif text-lg leading-snug text-charcoal transition-colors hover:text-oxblood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal md:text-xl"
                    >
                      {item.name}
                    </Link>
                    <p className="font-serif text-sm italic text-charcoal/75">
                      {item.descriptor}
                    </p>
                    {product && (
                      <p className="pt-1 text-[13px] tabular-nums tracking-wide text-charcoal/80">
                        {formatPrice(product.price)}
                      </p>
                    )}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Brand interlude ── */}
      <section className="bg-oxblood text-ivory">
        <div className="mx-auto max-w-editorial px-5 py-16 sm:px-6 md:px-10 md:py-24 lg:px-14 lg:py-28">
          <div className="editorial-reveal grid grid-cols-1 items-center gap-10 md:grid-cols-12 lg:gap-16">
            <div className="md:col-span-6 lg:col-span-5">
              <p className="mb-4 text-[11px] uppercase tracking-folio text-ivory/60">
                Why Lumenora
              </p>
              <h2 className="font-serif text-3xl leading-[1.15] text-ivory md:text-4xl lg:text-5xl">
                Many houses.
                <br />
                One considered edit.
              </h2>
              <p className="mt-8 max-w-md font-serif text-sm leading-relaxed text-ivory/70 md:text-[15px]">
                Lumenora is a premium multi-brand beauty retailer — not a single laboratory.
                We curate independent and established brands for how their formulas work
                together: skin, body, sun, and fragrance, guided by discovery rather than
                noise.
              </p>
              <Link
                to="/shop"
                className="mt-10 inline-flex min-h-11 items-center justify-center border border-ivory/80 bg-transparent px-8 text-[11px] font-medium uppercase tracking-folio text-ivory transition-colors hover:bg-ivory hover:text-oxblood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory"
              >
                Shop the Edit
              </Link>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <div className="group aspect-[4/3] overflow-hidden">
                <EditorialImg
                  src="/assets/generated/home-brand-interlude.jpg"
                  fallback="/assets/generated/blog-editorial-5.png"
                  alt="Botanical mineral texture"
                  width={900}
                  height={675}
                  className="editorial-image h-full w-full object-cover opacity-90"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Beauty Quiz ── */}
      <section
        aria-labelledby="home-quiz-heading"
        className="border-b border-charcoal/10 bg-parchment"
      >
        <div className="mx-auto max-w-editorial px-5 py-16 sm:px-6 md:px-10 md:py-24 lg:px-14">
          <div className="editorial-reveal grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-5">
              <div className="aspect-[4/3] overflow-hidden bg-ivory md:aspect-[5/4]">
                <EditorialImg
                  src="/assets/generated/quiz-result-radiance.png"
                  fallback="/assets/generated/home-ritual-treat.jpg"
                  alt="Beauty ritual discovery still-life"
                  width={800}
                  height={640}
                  className="editorial-image h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-7 md:pl-4 lg:pl-10">
              <p className="text-[11px] uppercase tracking-folio text-brass">
                Beauty desk quiz
              </p>
              <h2
                id="home-quiz-heading"
                className="mt-3 font-serif text-3xl text-charcoal md:text-4xl lg:text-5xl"
              >
                Find products across brands.
              </h2>
              <p className="mt-5 max-w-lg font-serif text-base leading-relaxed text-charcoal/75">
                Answer a few quiet questions about skin, climate, and ritual. We match you
                with formulas from different houses in our marketplace — never a one-brand
                prescription.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-charcoal/70">
                <li className="flex gap-2">
                  <span className="text-brass" aria-hidden>
                    —
                  </span>
                  Barrier-first recommendations
                </li>
                <li className="flex gap-2">
                  <span className="text-brass" aria-hidden>
                    —
                  </span>
                  Multi-brand pairings for cleanse, treat, protect
                </li>
                <li className="flex gap-2">
                  <span className="text-brass" aria-hidden>
                    —
                  </span>
                  Optional fragrance & body add-ons
                </li>
              </ul>
              <Link to="/quiz" className="cta-primary mt-8">
                Find Your Ritual
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Ritual ── */}
      <section className="border-b border-charcoal/10 bg-ivory">
        <div className="mx-auto max-w-editorial px-5 py-16 sm:px-6 md:px-10 md:py-24 lg:px-14 lg:py-28">
          <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-folio text-brass">
                The Ritual
              </p>
              <h2 className="font-serif text-3xl text-charcoal md:text-4xl">
                Cleanse. Treat. Protect.
              </h2>
            </div>
            <Link to="/shop" className="cta-text w-fit">
              Explore the Ritual
            </Link>
          </div>

          <div className="space-y-16 md:space-y-24">
            {ritualScenes.map((scene) => (
              <div
                key={scene.label}
                className="editorial-reveal group grid grid-cols-1 items-center gap-8 md:grid-cols-12 lg:gap-12"
              >
                <div
                  className={cn(
                    'md:col-span-7',
                    scene.imageFirst ? 'md:order-1' : 'md:order-2'
                  )}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-parchment">
                    <EditorialImg
                      src={scene.image}
                      fallback={scene.fallback}
                      alt={`${scene.label} ritual`}
                      width={1100}
                      height={825}
                      className="editorial-image h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div
                  className={cn(
                    'md:col-span-5',
                    scene.imageFirst ? 'md:order-2 md:pl-2' : 'md:order-1 md:pr-2'
                  )}
                >
                  <p className="mb-4 text-[11px] uppercase tracking-folio text-olive">
                    {scene.label}
                  </p>
                  <p className="mb-6 max-w-sm font-serif text-base leading-relaxed text-charcoal/75">
                    {scene.copy}
                  </p>
                  <ul className="border-t border-charcoal/15">
                    {scene.products.map((name) => {
                      const product = findProductByName(name);
                      if (!product) return null;
                      return <ProductLineItem key={product.id} product={product} />;
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bestsellers grid ── */}
      <section className="border-b border-charcoal/10 bg-parchment">
        <div className="mx-auto max-w-editorial px-5 py-16 sm:px-6 md:px-10 md:py-24 lg:px-14">
          <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-folio text-brass">
                From our shelves
              </p>
              <h2 className="mt-2 font-serif text-3xl text-charcoal md:text-4xl">
                New & most loved
              </h2>
            </div>
            <Link to="/shop?sort=bestsellers" className="cta-text w-fit">
              Shop Bestsellers
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Journal ── */}
      <section className="border-b border-charcoal/10 bg-ivory">
        <div className="mx-auto max-w-editorial px-5 py-16 sm:px-6 md:px-10 md:py-24 lg:px-14 lg:py-28">
          <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
            <h2 className="font-serif text-3xl text-charcoal md:text-4xl">
              The Lumenora Journal
            </h2>
            <Link to="/blog" className="cta-text w-fit">
              Read the Journal
            </Link>
          </div>

          <div className="editorial-reveal grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            <article className="lg:col-span-7">
              <Link
                to="/blog"
                className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-charcoal"
              >
                <div className="mb-6 aspect-[3/2] overflow-hidden bg-parchment">
                  <EditorialImg
                    src="/assets/generated/home-journal-primary.jpg"
                    fallback={primaryArticle.image}
                    alt={primaryArticle.title}
                    width={1200}
                    height={800}
                    className="editorial-image h-full w-full object-cover"
                  />
                </div>
                <p className="mb-3 text-[10px] uppercase tracking-folio text-brass">
                  {primaryArticle.category}
                </p>
                <h3 className="max-w-xl font-serif text-2xl leading-[1.2] text-charcoal transition-colors group-hover:text-oxblood md:text-3xl lg:text-4xl">
                  {primaryArticle.title}
                </h3>
              </Link>
            </article>

            <div className="flex flex-col justify-center lg:col-span-5">
              {supportArticles.map((article, idx) => (
                <article
                  key={article.id}
                  className={idx > 0 ? 'mt-8 border-t border-charcoal/15 pt-8' : ''}
                >
                  <Link
                    to="/blog"
                    className="group grid grid-cols-12 items-start gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-charcoal"
                  >
                    <div className="col-span-4 aspect-[4/3] overflow-hidden bg-parchment">
                      <img
                        src={article.image}
                        alt=""
                        width={320}
                        height={240}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="col-span-8">
                      <p className="mb-2 text-[11px] uppercase tracking-folio text-charcoal/70">
                        {article.category}
                      </p>
                      <h3 className="font-serif text-base leading-snug text-charcoal transition-colors group-hover:text-oxblood md:text-lg">
                        {article.title}
                      </h3>
                      <p className="mt-2 text-[11px] uppercase tracking-wider text-charcoal/60">
                        {article.date}
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section
        aria-label="Notes from the Beauty Desk"
        className="border-b border-ivory/15 bg-charcoal text-ivory"
      >
        <div className="mx-auto max-w-editorial px-5 py-16 sm:px-6 md:px-10 md:py-24 lg:px-14">
          <div className="max-w-xl">
            <p className="mb-4 text-[11px] uppercase tracking-folio text-ivory/65">
              Notes from the Beauty Desk
            </p>
            <h2 className="mb-4 font-serif text-4xl text-ivory md:text-5xl">The Edit</h2>
            <p className="mb-10 font-serif text-base italic text-ivory/75">
              Multi-brand beauty intelligence — new arrivals, rituals, and desk notes —
              delivered with intention.
            </p>

            <form
              className="border-b border-ivory/25 pb-3"
              onSubmit={onNewsletterSubmit}
              noValidate
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-4">
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <label
                    htmlFor="newsletter-email"
                    className="text-[11px] uppercase tracking-folio text-ivory/65"
                  >
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (newsletterStatus === 'error') {
                        setNewsletterStatus('idle');
                        setNewsletterMessage('');
                      }
                    }}
                    disabled={newsletterStatus === 'loading'}
                    aria-invalid={newsletterStatus === 'error'}
                    aria-describedby="newsletter-status"
                    placeholder="you@example.com"
                    className="w-full border-none bg-transparent py-2 text-sm text-ivory caret-parchment outline-none placeholder:text-ivory/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory disabled:opacity-60"
                  />
                </div>
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="inline-flex min-h-11 shrink-0 items-center justify-center border border-ivory/40 px-6 text-[11px] font-medium uppercase tracking-folio text-ivory transition-colors hover:border-ivory hover:bg-ivory hover:text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory disabled:cursor-wait disabled:opacity-60"
                >
                  {newsletterStatus === 'loading' ? 'Sending…' : 'Subscribe'}
                </button>
              </div>
              <p
                id="newsletter-status"
                role="status"
                aria-live="polite"
                className={cn(
                  'mt-3 min-h-[1.25rem] text-sm',
                  newsletterStatus === 'error' && 'text-red-200',
                  newsletterStatus === 'success' && 'text-parchment',
                  newsletterStatus === 'idle' && 'text-transparent'
                )}
              >
                {newsletterMessage || ' '}
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
