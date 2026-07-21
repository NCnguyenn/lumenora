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
  type ReactNode,
} from 'react';
import { products, type Product } from '../data/products';
import {
  categoryLabel,
  getPrimaryImage,
  getProductById,
} from '../data/productSelectors';
import { getProductMerchandising } from '../data/productMerchandising';
import { articles } from '../data/articles';
import { useAppStore } from '../store/useAppStore';
import { ProductCard } from '../components/ui/ProductCard';
import { ProductPrice } from '../components/ui/ProductPrice';
import { ProductTag } from '../components/ui/ProductTag';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

/** Darker brass for small UI labels — meets WCAG AA on ivory (~4.7:1). */
const LABEL =
  'text-[11px] font-medium uppercase tracking-folio text-[#6B5638]';
const LABEL_SM =
  'text-[10px] font-medium uppercase tracking-folio text-[#6B5638]';
const META = 'text-[11px] uppercase tracking-wider text-charcoal/65';

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

function SectionHeader({
  eyebrow,
  title,
  lead,
  action,
  invert = false,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  action?: ReactNode;
  invert?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8',
        className,
      )}
    >
      <div className="min-w-0 max-w-2xl">
        {eyebrow ? (
          <p className={cn(LABEL, invert && 'text-ivory/70')}>{eyebrow}</p>
        ) : null}
        <h2
          className={cn(
            'font-serif text-3xl leading-tight md:text-4xl',
            eyebrow && 'mt-2',
            invert ? 'text-ivory' : 'text-charcoal',
          )}
        >
          {title}
        </h2>
        {lead ? (
          <div
            className={cn(
              'mt-4 font-serif text-base italic leading-relaxed md:text-lg',
              invert ? 'text-ivory/75' : 'text-charcoal/75',
            )}
          >
            {lead}
          </div>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
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
    // Distinct from compositions hero to avoid visual déjà vu mid-page
    imageSrc: '/assets/generated/home-daily-edit.jpg',
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
    name: 'Skincare',
    href: '/shop?category=skin',
    image: '/assets/generated/home-contents-skin.jpg',
    fallback: '/assets/generated/product-serum.png',
    alt: 'Curated skincare close-up',
  },
  {
    name: 'Bodycare',
    href: '/shop?category=body',
    image: '/assets/generated/home-contents-body.jpg',
    fallback: '/assets/generated/home-feature-lotion.png',
    alt: 'Body care cream texture',
  },
  {
    name: 'Suncare',
    href: '/shop?category=sun',
    image: '/assets/generated/home-contents-sun.jpg',
    fallback: '/assets/generated/product-sunscreen.png',
    alt: 'Sun care with foliage',
  },
  {
    name: 'Fragrance',
    href: '/shop?category=fragrance',
    // Prefer fragrance product art over skincare serum fallback
    image: '/assets/products/cedar-fig-eau-de-parfum/01-primary.webp',
    fallback: '/assets/products/soft-linen-hair-body-mist/01-primary.webp',
    alt: 'Fragrance bottle still-life',
  },
] as const;

const trustBadges = [
  {
    label: 'Authenticity',
    detail: 'Authorized multi-brand sourcing',
  },
  {
    label: 'Shipping',
    detail: 'Free on orders $50+',
  },
  {
    label: 'Curation',
    detail: 'Edited for ritual, not hype',
  },
  {
    label: 'Returns',
    detail: 'Easy 30-day returns',
  },
] as const;

/** Master §6.1 — Home product map by stable id (not name). */
const dailyEditIds = ['p1', 'p2', 'p3'] as const;

const compositions = [
  {
    productId: 'p8',
    descriptor: 'Viscous repair for depleted skin — a cult formula, curated for ritual.',
    image: '/assets/generated/home-composition-serum.jpg',
    fallback: '/assets/generated/product-serum.png',
  },
  {
    productId: 'p10',
    descriptor: 'Mineral depth. Quiet clarity.',
    image: '/assets/generated/home-composition-mask.jpg',
    fallback: '/assets/generated/product-mask.png',
  },
  {
    productId: 'p11',
    descriptor: 'Sheer protection that disappears into the day.',
    image: '/assets/generated/home-composition-sunscreen.jpg',
    fallback: '/assets/generated/product-sunscreen.png',
  },
] as const;

/** Compact ritual strip — three steps without full-page product list repetition. */
const ritualSteps = [
  {
    label: 'Cleanse',
    copy: 'Lift without stripping — multi-house formulas for a quiet reset.',
    image: '/assets/generated/home-ritual-cleanse.jpg',
    fallback: '/assets/generated/product-cleanser.png',
    productIds: ['p7', 'p5'] as const,
  },
  {
    label: 'Treat',
    copy: 'Layer actives with restraint across essence and cream.',
    image: '/assets/generated/home-ritual-treat.jpg',
    fallback: '/assets/generated/product-serum.png',
    productIds: ['p8', 'p3'] as const,
  },
  {
    label: 'Protect',
    copy: 'Seal the day with fluid sun care and body nourishment.',
    image: '/assets/generated/home-ritual-protect.jpg',
    fallback: '/assets/generated/product-sunscreen.png',
    productIds: ['p11', 'p4'] as const,
  },
] as const;

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
  const defaultVariant =
    product.variants.find((variant) => variant.id === product.defaultVariantId) ??
    product.variants[0];
  const thumb = getPrimaryImage(product);
  const merchandising = getProductMerchandising(product, defaultVariant);

  return (
    <li className="border-b border-charcoal/15 last:border-b-0">
      <div className="flex items-center gap-3 py-3.5 sm:gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-parchment sm:h-16 sm:w-16">
          {thumb ? (
            <img
              src={thumb.src}
              alt=""
              width={64}
              height={64}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        <Link
          to={`/products/${product.slug}`}
          className="min-w-0 flex-1 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
        >
          <p className={LABEL_SM}>{product.brand}</p>
          <p className="mt-0.5 font-serif text-[15px] leading-snug text-charcoal transition-colors group-hover:text-oxblood">
            {product.name}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className={META}>{categoryLabel(product.category)}</span>
            <ProductTag
              tag={merchandising.tag}
              placement="inline"
              className="px-2 py-1 text-[8px]"
            />
          </div>
        </Link>

        <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-1">
          <ProductPrice
            merchandising={merchandising}
            compact
            className="justify-end tracking-wide text-charcoal/80"
          />
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => {
                toggleWishlist(product.id);
                if (!wishlisted) {
                  toast.success(`Added "${product.name}" to wishlist!`);
                } else {
                  toast(`Removed "${product.name}" from wishlist`);
                }
              }}
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
              onClick={() => {
                if (!defaultVariant) return;
                addToCart(product.id, defaultVariant.id);
                toast.success(`Added "${product.name}" to cart!`);
              }}
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

function CompositionCaption({
  product,
  title,
  href,
  descriptor,
}: {
  product?: Product;
  title: string;
  href: string;
  descriptor: string;
}) {
  const merchandising = product
    ? getProductMerchandising(product)
    : null;

  return (
    <figcaption className="mt-5 space-y-1 border-t border-charcoal/15 pt-4">
      {product?.brand ? <p className={LABEL_SM}>{product.brand}</p> : null}
      <Link
        to={href}
        className="block font-serif text-lg leading-snug text-charcoal transition-colors hover:text-oxblood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal md:text-xl"
      >
        {title}
      </Link>
      <p className="font-serif text-sm italic text-charcoal/75">{descriptor}</p>
      {merchandising ? (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <ProductTag
            tag={merchandising.tag}
            placement="inline"
            className="px-2 py-1 text-[8px]"
          />
          <ProductPrice
            merchandising={merchandising}
            compact
            className="tracking-wide text-charcoal/80"
          />
        </div>
      ) : null}
    </figcaption>
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
        a.title === "Why Snail Mucin is the Skincare Ingredient You Can't Ignore",
    ) ?? articles[0];
  const supportArticles = [
    articles.find((a) => a.title === 'The Ultimate Guide to Double Cleansing'),
    articles.find((a) => a.title === 'How to Repair a Damaged Skin Barrier'),
  ].filter(Boolean) as typeof articles;

  const dailyEdit = useMemo(
    () =>
      dailyEditIds
        .map((id) => getProductById(id))
        .filter((product): product is Product => Boolean(product)),
    [],
  );

  /** Mix bestsellers and new arrivals so badges stay meaningful. */
  const shelfProducts = useMemo(() => {
    const bestsellers = products.filter((p) => p.tag === 'best-seller');
    const news = products.filter((p) => p.tag === 'new');
    const rest = products.filter(
      (p) => p.tag !== 'best-seller' && p.tag !== 'new',
    );
    return [...bestsellers, ...news, ...rest].slice(0, 4);
  }, []);

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
        className="group relative h-[min(90vh,840px)] min-h-[520px] w-full overflow-hidden bg-charcoal md:min-h-[600px]"
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
                prefersReducedMotion && 'transition-none',
              )}
            >
              <div
                className="absolute inset-0 z-10 bg-gradient-to-b from-charcoal/55 via-charcoal/35 to-charcoal/55"
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
                  active && !prefersReducedMotion && 'is-active',
                )}
              />
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 pb-16 pt-10 text-center text-white sm:px-10">
                <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.25em] text-white/90 md:mb-6 md:text-xs">
                  {slide.subtitle}
                </p>
                {active ? (
                  <h1 className="mb-6 max-w-4xl whitespace-pre-line font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl md:mb-8 md:text-7xl lg:text-[6.25rem]">
                    {slide.title}
                  </h1>
                ) : (
                  <p className="mb-6 max-w-4xl whitespace-pre-line font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl md:mb-8 md:text-7xl lg:text-[6.25rem]">
                    {slide.title}
                  </p>
                )}
                <p className="mx-auto mb-8 max-w-md font-serif text-sm leading-relaxed text-white/90 md:mb-10 md:text-base">
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

        {/* Arrows: lightly visible on desktop for discoverability */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-2 top-[42%] z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition-all hover:bg-black/50 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:left-6 md:top-1/2 md:-translate-y-1/2 md:opacity-45 md:group-hover:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" aria-hidden />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-2 top-[42%] z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition-all hover:bg-black/50 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:right-6 md:top-1/2 md:-translate-y-1/2 md:opacity-45 md:group-hover:opacity-100"
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
                  idx === currentSlide ? 'w-10 bg-white' : 'w-6 bg-white/45',
                )}
                aria-hidden
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsPaused((paused) => !paused)}
          aria-label={
            isPaused || prefersReducedMotion ? 'Play slideshow' : 'Pause slideshow'
          }
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
        <div className="mx-auto max-w-editorial px-5 pt-14 pb-10 sm:px-6 md:px-10 md:pt-20 md:pb-14 lg:px-14 lg:pt-24">
          <div className="editorial-reveal">
            <SectionHeader
              eyebrow="Shop by collection"
              title="Four shelves. Many houses."
              lead="Skin, body, sun, and fragrance — assembled as a considered daily edit across many brands, rather than a catalogue of one house."
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.href}
              className="editorial-reveal group relative block aspect-[4/3] overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white lg:aspect-[3/4]"
            >
              <EditorialImg
                src={cat.image}
                fallback={cat.fallback}
                alt={cat.alt}
                width={800}
                height={1000}
                className="editorial-image h-full w-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/70"
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 p-5 text-center md:p-7">
                <span className="font-sans text-lg font-medium uppercase tracking-[0.16em] text-white md:text-xl lg:text-[1.55rem]">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Trust bar — unique label + supporting detail */}
        <div className="border-t border-charcoal/10 bg-ivory">
          <div className="mx-auto max-w-editorial">
            <ul className="grid grid-cols-2 md:grid-cols-4">
              {trustBadges.map((badge) => (
                <li
                  key={badge.label}
                  className="flex flex-col items-center justify-center gap-1.5 border-b border-r border-charcoal/10 px-4 py-5 text-center last:border-r-0 even:border-r-0 md:border-b-0 md:py-7 md:even:border-r md:last:border-r-0"
                >
                  <span className={cn(LABEL_SM, 'text-charcoal/60')}>
                    {badge.label}
                  </span>
                  <span className="max-w-[14rem] text-xs font-medium leading-snug text-charcoal md:text-sm">
                    {badge.detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── The Daily Edit ── */}
      <section className="border-b border-charcoal/10 bg-parchment">
        <div className="mx-auto max-w-editorial px-5 py-14 sm:px-6 md:px-10 md:py-20 lg:px-14 lg:py-24">
          <div className="editorial-reveal grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
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

            <div className="lg:col-span-5 lg:pt-1">
              <p className={cn(LABEL, 'mb-2')}>The Daily Edit</p>
              <h2 className="font-serif text-2xl text-charcoal md:text-3xl lg:text-[2rem]">
                Morning sequence
              </h2>
              <p className="mb-7 mt-4 max-w-md font-serif text-base leading-relaxed text-charcoal/80">
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
        <div className="mx-auto max-w-editorial space-y-12 px-5 py-14 sm:px-6 md:space-y-16 md:px-10 md:py-20 lg:px-14 lg:py-24">
          <div className="editorial-reveal">
            <SectionHeader
              title="Compositions for the Skin"
              lead="Curated still-lifes from our multi-brand shelves — each formula given its own frame, each house credited."
            />
          </div>

          {(() => {
            const item = compositions[0];
            const product = getProductById(item.productId);
            const title = product?.name ?? 'Featured formula';
            return (
              <figure className="editorial-reveal group w-full">
                <div className="aspect-[16/10] overflow-hidden bg-parchment md:aspect-[21/9]">
                  <EditorialImg
                    src={item.image}
                    fallback={item.fallback}
                    alt={title}
                    width={1600}
                    height={700}
                    className="editorial-image h-full w-full object-cover"
                  />
                </div>
                <CompositionCaption
                  product={product}
                  title={title}
                  href={product ? `/products/${product.slug}` : '/shop'}
                  descriptor={item.descriptor}
                />
              </figure>
            );
          })()}

          <div
            data-layout="home-compositions"
            className="grid grid-cols-1 items-start gap-12 md:grid-cols-12 md:gap-8 lg:gap-12"
          >
            {compositions.slice(1).map((item, i) => {
              const product = getProductById(item.productId);
              const title = product?.name ?? 'Featured formula';
              return (
                <figure
                  key={item.productId}
                  className={cn(
                    'editorial-reveal group',
                    i === 0
                      ? 'md:col-span-5'
                      : 'md:col-span-6 md:col-start-7 md:mt-10',
                  )}
                >
                  <div className="aspect-square overflow-hidden bg-parchment">
                    <EditorialImg
                      src={item.image}
                      fallback={item.fallback}
                      alt={title}
                      width={900}
                      height={900}
                      className="editorial-image h-full w-full object-cover"
                    />
                  </div>
                  <CompositionCaption
                    product={product}
                    title={title}
                    href={product ? `/products/${product.slug}` : '/shop'}
                    descriptor={item.descriptor}
                  />
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Brand interlude ── */}
      <section className="bg-oxblood text-ivory">
        <div className="mx-auto max-w-editorial px-5 py-14 sm:px-6 md:px-10 md:py-20 lg:px-14 lg:py-24">
          <div className="editorial-reveal grid grid-cols-1 items-center gap-10 md:grid-cols-12 lg:gap-16">
            <div className="md:col-span-6 lg:col-span-5">
              <p className={cn(LABEL, 'mb-3 text-ivory/70')}>Why Lumenora</p>
              <h2 className="font-serif text-3xl leading-[1.15] text-ivory md:text-4xl lg:text-5xl">
                Many houses.
                <br />
                One considered edit.
              </h2>
              <p className="mt-7 max-w-md font-serif text-sm leading-relaxed text-ivory/75 md:text-[15px]">
                Lumenora is a premium multi-brand beauty retailer — not a single laboratory.
                We curate independent and established brands for how their formulas work
                together: skin, body, sun, and fragrance, guided by discovery rather than
                noise.
              </p>
              <Link
                to="/shop"
                className="mt-9 inline-flex min-h-11 items-center justify-center border border-ivory/80 bg-transparent px-8 text-[11px] font-medium uppercase tracking-folio text-ivory transition-colors hover:bg-ivory hover:text-oxblood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory"
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
        <div className="mx-auto max-w-editorial px-5 py-14 sm:px-6 md:px-10 md:py-20 lg:px-14">
          <div className="editorial-reveal grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-5">
              <div className="aspect-[4/3] overflow-hidden bg-ivory md:aspect-[5/4]">
                <EditorialImg
                  src="/assets/generated/home-ritual-treat.jpg"
                  fallback="/assets/generated/quiz-result-radiance.png"
                  alt="Beauty ritual discovery still-life"
                  width={800}
                  height={640}
                  className="editorial-image h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-7 md:pl-4 lg:pl-10">
              <p className={LABEL}>Beauty desk quiz</p>
              <h2
                id="home-quiz-heading"
                className="mt-2 font-serif text-3xl text-charcoal md:text-4xl lg:text-5xl"
              >
                Find products across brands.
              </h2>
              <p className="mt-5 max-w-lg font-serif text-base leading-relaxed text-charcoal/75">
                Answer a few quiet questions about skin, climate, and ritual. We match you
                with formulas from different houses in our marketplace — never a one-brand
                prescription.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-charcoal/70">
                {[
                  'Barrier-first recommendations',
                  'Multi-brand pairings for cleanse, treat, protect',
                  'Optional fragrance & body add-ons',
                ].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-2 h-px w-3 shrink-0 bg-[#6B5638]" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/quiz" className="cta-primary mt-8">
                Find Your Ritual
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Ritual (compact 3-up) ── */}
      <section className="border-b border-charcoal/10 bg-ivory">
        <div className="mx-auto max-w-editorial px-5 py-14 sm:px-6 md:px-10 md:py-20 lg:px-14 lg:py-24">
          <SectionHeader
            className="mb-10 md:mb-14"
            eyebrow="The Ritual"
            title="Cleanse. Treat. Protect."
            lead="A three-step sequence across houses — short enough to keep, considered enough to last."
            action={
              <Link to="/shop" className="cta-text w-fit">
                Explore the Ritual
              </Link>
            }
          />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
            {ritualSteps.map((step) => (
              <article
                key={step.label}
                className="editorial-reveal group flex flex-col border border-charcoal/10 bg-ivory"
              >
                <div className="aspect-[4/3] overflow-hidden bg-parchment">
                  <EditorialImg
                    src={step.image}
                    fallback={step.fallback}
                    alt={`${step.label} ritual`}
                    width={800}
                    height={600}
                    className="editorial-image h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-folio text-olive">
                    {step.label}
                  </p>
                  <p className="mb-5 font-serif text-[15px] leading-relaxed text-charcoal/75">
                    {step.copy}
                  </p>
                  <ul className="mt-auto space-y-2 border-t border-charcoal/10 pt-4">
                    {step.productIds.map((productId) => {
                      const product = getProductById(productId);
                      if (!product) return null;
                      const merchandising = getProductMerchandising(product);
                      return (
                        <li key={product.id}>
                          <Link
                            to={`/products/${product.slug}`}
                            className="group/link flex items-start justify-between gap-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
                          >
                            <span className="flex min-w-0 flex-col items-start gap-1.5">
                              <span className="font-serif text-sm leading-snug text-charcoal transition-colors group-hover/link:text-oxblood">
                                {product.name}
                              </span>
                              <ProductTag
                                tag={merchandising.tag}
                                placement="inline"
                                className="px-2 py-1 text-[8px]"
                              />
                            </span>
                            <ProductPrice
                              merchandising={merchandising}
                              compact
                              className="shrink-0 justify-end text-charcoal/65"
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bestsellers grid ── */}
      <section className="border-b border-charcoal/10 bg-parchment">
        <div className="mx-auto max-w-editorial px-5 py-14 sm:px-6 md:px-10 md:py-20 lg:px-14">
          <SectionHeader
            className="mb-10 md:mb-12"
            eyebrow="From our shelves"
            title="New & most loved"
            action={
              <Link to="/shop?sort=bestsellers" className="cta-text w-fit">
                Shop Bestsellers
              </Link>
            }
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {shelfProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Journal ── */}
      <section className="border-b border-charcoal/10 bg-ivory">
        <div className="mx-auto max-w-editorial px-5 py-14 sm:px-6 md:px-10 md:py-20 lg:px-14 lg:py-24">
          <SectionHeader
            className="mb-10 md:mb-14"
            eyebrow="From the desk"
            title="The Lumenora Journal"
            action={
              <Link to="/blog" className="cta-text w-fit">
                Read the Journal
              </Link>
            }
          />

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
                <p className={cn(LABEL_SM, 'mb-3')}>{primaryArticle.category}</p>
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
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="col-span-8">
                      <p className={cn(META, 'mb-2')}>{article.category}</p>
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
        <div className="mx-auto max-w-editorial px-5 py-14 sm:px-6 md:px-10 md:py-20 lg:px-14 lg:py-24">
          <div className="max-w-xl">
            <p className="mb-3 text-[11px] uppercase tracking-folio text-ivory/70">
              Notes from the Beauty Desk
            </p>
            <h2 className="mb-4 font-serif text-4xl text-ivory md:text-5xl">The Edit</h2>
            <p className="mb-10 font-serif text-base italic leading-relaxed text-ivory/75">
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
                    className="text-[11px] uppercase tracking-folio text-ivory/70"
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
                  newsletterStatus === 'idle' && 'text-transparent',
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
