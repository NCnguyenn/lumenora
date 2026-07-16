import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useState, useEffect, type ImgHTMLAttributes } from 'react';
import { products } from '../data/products';
import { articles } from '../data/articles';
import { Button } from '../components/ui/Button';

/** Prefer art-directed editorial JPGs; fall back to existing generated PNGs if not copied yet. */
function EditorialImg({
  src,
  fallback,
  alt,
  className,
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
    image: '/assets/generated/hero-1.png',
    subtitle: 'The Summer Edit',
    title: 'Less routine.\nMore ritual.',
    description: 'A seasonal edit across skin, body and mind.',
    textColor: 'text-white',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=3840&auto=format&fit=crop',
    subtitle: 'Botanical Science',
    title: "Nature's\nFinest.",
    description: 'Discover our latest botanical formulations.',
    textColor: 'text-white',
  },
  {
    id: 3,
    image: '/assets/generated/hero-3.png',
    subtitle: 'Bestsellers',
    title: 'Radiance\nRestored.',
    description: "The community's most-loved essentials.",
    textColor: 'text-white',
  },
];

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

function findProduct(name: string) {
  return products.find((p) => p.name === name);
}

const dailyEditProducts = [
  'Bamboo Ultra Hydrating Toner',
  'Birch Moisturizing Soothing Gel',
  'Mugwort Calming Cream',
] as const;

const compositions = [
  {
    name: 'Advanced Snail Mucin 96% Power Repairing Essence Serum',
    descriptor: 'Viscous repair for depleted skin.',
    image: '/assets/generated/home-composition-serum.jpg',
    fallback: '/assets/generated/product-serum.png',
    layout: 'panorama' as const,
  },
  {
    name: 'Volcanic Sea Clay Detox Masque',
    descriptor: 'Mineral depth. Quiet clarity.',
    image: '/assets/generated/home-composition-mask.jpg',
    fallback: '/assets/generated/product-mask.png',
    layout: 'square' as const,
  },
  {
    name: 'Invisible Fluid Sunscreen SPF 50+ PA++++',
    descriptor: 'Sheer protection that disappears into ritual.',
    image: '/assets/generated/home-composition-sunscreen.jpg',
    fallback: '/assets/generated/product-sunscreen.png',
    layout: 'portrait' as const,
  },
];

const ritualScenes = [
  {
    label: 'CLEANSE',
    copy: 'Begin with water and intention. Formulas that lift without stripping the barrier.',
    image: '/assets/generated/home-ritual-cleanse.jpg',
    fallback: '/assets/generated/product-cleanser.png',
    imageFirst: true,
    products: ['Green Tea Deep Cleansing', 'Eucalyptus Nourishing Body Cleanser'],
  },
  {
    label: 'TREAT',
    copy: 'Layer actives with restraint. Essence and cream working in quiet sequence.',
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

export function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const primaryArticle =
    articles.find(
      (a) => a.title === "Why Snail Mucin is the Skincare Ingredient You Can't Ignore"
    ) ?? articles[0];
  const supportArticles = [
    articles.find((a) => a.title === 'The Ultimate Guide to Double Cleansing'),
    articles.find((a) => a.title === 'How to Repair a Damaged Skin Barrier'),
  ].filter(Boolean) as typeof articles;

  return (
    <div className="flex flex-col bg-ivory text-charcoal">
      {/* ── Existing Hero — preserved ── */}
      <section
        aria-label="Seasonal skincare edits"
        aria-roledescription="carousel"
        className="relative w-full h-[80vh] min-h-[600px] md:h-[95vh] overflow-hidden bg-black group"
      >
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            role="group"
            aria-label={`${index + 1} of ${heroSlides.length}`}
            aria-roledescription="slide"
            aria-hidden={index !== currentSlide}
            inert={index !== currentSlide}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/30 z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-out ${
                index === currentSlide ? 'scale-105' : 'scale-100'
              }`}
            />
            <div
              className={`absolute inset-0 z-20 flex flex-col justify-center items-center text-center p-6 ${slide.textColor}`}
            >
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] mb-6 text-white/80">
                {slide.subtitle}
              </p>
              <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-serif leading-[1.1] mb-8 tracking-tight whitespace-pre-line">
                {slide.title}
              </h1>
              <p className="text-sm md:text-base font-serif max-w-md mx-auto mb-10 text-white/90">
                {slide.description}
              </p>
              <Link to="/shop">
                <Button className="bg-transparent border border-white text-white hover:bg-white hover:text-black transition-colors duration-300 px-8 py-3 h-auto text-xs tracking-widest font-bold">
                  SHOP NOW
                </Button>
              </Link>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-4">
          {heroSlides.map((_, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-[2px] transition-all duration-500 ${
                idx === currentSlide ? 'w-16 bg-white' : 'w-8 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsPaused((paused) => !paused)}
          aria-label={isPaused ? 'Play slideshow' : 'Pause slideshow'}
          className="absolute bottom-5 right-5 md:bottom-7 md:right-8 z-30 grid h-9 w-9 place-items-center border border-white/40 bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {isPaused ? (
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Pause className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      </section>

      {/* ── Contents — Skin, Body, Sun ── */}
      <section id="home-categories" className="bg-ivory border-b border-charcoal/10">
        <div className="mx-auto max-w-editorial px-6 md:px-10 lg:px-14 py-20 md:py-28">
          <p className="editorial-reveal max-w-xl text-base font-serif italic text-charcoal/75 leading-relaxed mb-14 md:mb-20">
            Three fields of practice — skin, body, and sun — assembled as a considered
            daily edit rather than a catalogue of categories.
          </p>

          <div
            data-layout="home-categories"
            className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8 lg:grid-cols-12 lg:gap-7 xl:gap-10 items-start"
          >
            {/* Large vertical skin */}
            <Link
              to="/shop"
              className="editorial-reveal group md:col-span-1 lg:col-span-5"
            >
              <figure>
                <div className="aspect-[4/5] overflow-hidden bg-parchment">
                  <EditorialImg
                    src="/assets/generated/home-contents-skin.jpg"
                    fallback="/assets/generated/product-serum.png"
                    alt="Skin ritual still-life"
                    className="editorial-image w-full h-full object-cover"
                  />
                </div>
                <figcaption className="mt-5 border-t border-charcoal/20 pt-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="font-serif text-2xl text-charcoal">Skin</h2>
                    <span className="editorial-link text-[11px] uppercase tracking-folio text-charcoal/75">
                      Explore
                    </span>
                  </div>
                  <p className="mt-2 text-[15px] font-serif text-charcoal/75">
                    Nourish, renew and restore.
                  </p>
                </figcaption>
              </figure>
            </Link>

            {/* Low horizontal body — offset */}
            <Link
              to="/shop"
              className="editorial-reveal group md:col-span-1 md:mt-10 lg:col-span-4 lg:mt-16"
            >
              <figure>
                <div className="aspect-[4/3] overflow-hidden bg-parchment">
                  <EditorialImg
                    src="/assets/generated/home-contents-body.jpg"
                    fallback="/assets/generated/home-feature-lotion.png"
                    alt="Body cream texture"
                    className="editorial-image w-full h-full object-cover"
                  />
                </div>
                <figcaption className="mt-5 border-t border-charcoal/20 pt-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="font-serif text-2xl text-charcoal">Body</h2>
                    <span className="editorial-link text-[11px] uppercase tracking-folio text-charcoal/75">
                      Explore
                    </span>
                  </div>
                  <p className="mt-2 text-[15px] font-serif text-charcoal/75">
                    Hydrate, soften and replenish.
                  </p>
                </figcaption>
              </figure>
            </Link>

            {/* Smaller sun with open paper */}
            <Link
              to="/shop"
              className="editorial-reveal group md:col-span-1 md:col-start-2 lg:col-span-3 lg:col-start-auto lg:mt-28"
            >
              <figure>
                <div className="aspect-[3/4] overflow-hidden bg-parchment">
                  <EditorialImg
                    src="/assets/generated/home-contents-sun.jpg"
                    fallback="/assets/generated/product-sunscreen.png"
                    alt="Sun care with foliage"
                    className="editorial-image w-full h-full object-cover"
                  />
                </div>
                <figcaption className="mt-5 border-t border-charcoal/20 pt-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="font-serif text-2xl text-charcoal">Sun</h2>
                    <span className="editorial-link text-[11px] uppercase tracking-folio text-charcoal/75">
                      Explore
                    </span>
                  </div>
                  <p className="mt-2 text-[15px] font-serif text-charcoal/75">
                    Shield skin with daily protection.
                  </p>
                </figcaption>
              </figure>
            </Link>
          </div>
        </div>
      </section>

      {/* ── The Daily Edit ── */}
      <section className="bg-parchment border-b border-charcoal/10">
        <div className="mx-auto max-w-editorial px-6 md:px-10 lg:px-14 py-20 md:py-28">
          <div className="editorial-reveal grid grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="col-span-12 lg:col-span-8">
              <div className="aspect-[4/3] overflow-hidden bg-ivory">
                <EditorialImg
                  src="/assets/generated/home-daily-edit.jpg"
                  fallback="/assets/generated/home-hero.png"
                  alt="Daily edit still-life on wet limestone"
                  className="editorial-image w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 lg:pt-4">
              <p className="text-[11px] uppercase tracking-folio text-brass mb-4">
                The Daily Edit
              </p>
              <p className="font-serif text-base leading-relaxed text-charcoal/80 mb-10 max-w-md">
                Three formulas for the morning sequence — toner, gel, cream — chosen for
                quiet hydration rather than spectacle.
              </p>

              <ul className="border-t border-charcoal/20">
                {dailyEditProducts.map((name) => {
                  const product = findProduct(name);
                  if (!product) return null;
                  return (
                    <li key={product.id} className="border-b border-charcoal/20">
                      <Link
                        to="/shop"
                        className="flex flex-col gap-1 py-5 group hover:bg-charcoal/[0.02] transition-colors"
                      >
                        <span className="font-serif text-[15px] leading-snug text-charcoal group-hover:text-oxblood transition-colors">
                          {product.name}
                        </span>
                        <span className="text-[12px] tracking-wide text-charcoal/70">
                          {formatPrice(product.price)}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Compositions for the Skin ── */}
      <section id="home-compositions" className="bg-ivory border-b border-charcoal/10">
        <div className="mx-auto max-w-editorial px-6 md:px-10 lg:px-14 py-20 md:py-28 space-y-16 md:space-y-20">
          <div className="editorial-reveal max-w-xl">
            <h2 className="font-serif text-3xl md:text-4xl leading-tight text-charcoal">
              Compositions for the Skin
            </h2>
            <p className="mt-4 text-base font-serif italic text-charcoal/75 leading-relaxed">
              Curated still-lifes, not a shelf of equals — each formula given its own frame.
            </p>
          </div>

          {/* Panoramic */}
          {(() => {
            const item = compositions[0];
            const product = findProduct(item.name);
            return (
              <figure className="editorial-reveal group w-full">
                <div className="aspect-[16/7] md:aspect-[21/8] overflow-hidden bg-parchment">
                  <EditorialImg
                    src={item.image}
                    fallback={item.fallback}
                    alt={item.name}
                    className="editorial-image w-full h-full object-cover"
                  />
                </div>
                <figcaption className="mt-5 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 max-w-3xl">
                  <div>
                    <Link
                      to="/shop"
                      className="font-serif text-lg md:text-xl text-charcoal hover:text-oxblood transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm text-charcoal/75 font-serif italic">
                      {item.descriptor}
                    </p>
                  </div>
                  {product && (
                    <span className="text-[13px] tracking-wide text-charcoal/80 shrink-0">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </figcaption>
              </figure>
            );
          })()}

          <div
            data-layout="home-compositions"
            className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-8 lg:gap-12 items-start"
          >
          {/* Square held to one side */}
          {(() => {
            const item = compositions[1];
            const product = findProduct(item.name);
            return (
              <figure className="editorial-reveal group md:col-span-5">
                <div className="aspect-square overflow-hidden bg-parchment">
                  <EditorialImg
                    src={item.image}
                    fallback={item.fallback}
                    alt={item.name}
                    className="editorial-image w-full h-full object-cover"
                  />
                </div>
                <figcaption className="mt-5 border-t border-charcoal/20 pt-4 space-y-1">
                  <Link
                    to="/shop"
                    className="font-serif text-lg text-charcoal hover:text-oxblood transition-colors block"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-charcoal/75 font-serif italic">
                    {item.descriptor}
                  </p>
                  {product && (
                    <p className="text-[13px] tracking-wide text-charcoal/80 pt-1">
                      {formatPrice(product.price)}
                    </p>
                  )}
                </figcaption>
              </figure>
            );
          })()}

          {/* Tall portrait + compact text */}
          {(() => {
            const item = compositions[2];
            const product = findProduct(item.name);
            return (
              <figure className="editorial-reveal group md:col-span-6 md:col-start-7 md:mt-12">
                <div>
                  <div className="aspect-square overflow-hidden bg-parchment">
                    <EditorialImg
                      src={item.image}
                      fallback={item.fallback}
                      alt={item.name}
                      className="editorial-image w-full h-full object-cover"
                    />
                  </div>
                </div>
                <figcaption className="mt-5 border-t border-charcoal/20 pt-4">
                  <Link
                    to="/shop"
                    className="font-serif text-xl md:text-2xl leading-snug text-charcoal hover:text-oxblood transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-3 text-sm font-serif italic text-charcoal/75 leading-relaxed">
                    {item.descriptor}
                  </p>
                  {product && (
                    <p className="mt-3 text-[13px] tracking-wide text-charcoal/80">
                      {formatPrice(product.price)}
                    </p>
                  )}
                </figcaption>
              </figure>
            );
          })()}
          </div>
        </div>
      </section>

      {/* ── Brand Interlude ── */}
      <section className="bg-oxblood text-ivory">
        <div className="mx-auto max-w-editorial px-6 md:px-10 lg:px-14 py-20 md:py-28">
          <div className="editorial-reveal grid grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="col-span-12 md:col-span-6 lg:col-span-5">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.15] text-ivory">
                Many formulas.
                <br />
                One considered ritual.
              </h2>
              <p className="mt-8 text-sm md:text-[15px] leading-relaxed text-ivory/70 max-w-md font-serif">
                Lumenora gathers botanical intelligence into a unified selection —
                formulas chosen for how they work together, guided by discovery rather than
                noise. Not a marketplace of everything. An edit with a point of view.
              </p>
            </div>
            <div className="col-span-10 col-start-3 md:col-span-5 md:col-start-8 lg:col-start-8">
              <div className="group aspect-[4/3] overflow-hidden">
                <EditorialImg
                  src="/assets/generated/home-brand-interlude.jpg"
                  fallback="/assets/generated/blog-editorial-5.png"
                  alt="Botanical mineral texture"
                  className="editorial-image w-full h-full object-cover opacity-90"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Ritual ── */}
      <section className="bg-ivory border-b border-charcoal/10">
        <div className="mx-auto max-w-editorial px-6 md:px-10 lg:px-14 py-20 md:py-28">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-24">
            <div>
              <p className="text-[11px] uppercase tracking-folio text-brass mb-3">
                The Ritual
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-charcoal">
                Cleanse. Treat. Protect.
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-[11px] uppercase tracking-folio text-charcoal border-b border-charcoal/40 pb-1 hover:border-oxblood hover:text-oxblood transition-colors w-fit"
            >
              Explore the Ritual
            </Link>
          </div>

          <div className="space-y-20 md:space-y-28">
            {ritualScenes.map((scene) => (
              <div
                key={scene.label}
                className="editorial-reveal group grid grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                <div
                  className={`col-span-12 md:col-span-7 ${
                    scene.imageFirst ? 'md:order-1' : 'md:order-2'
                  }`}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-parchment">
                    <EditorialImg
                      src={scene.image}
                      fallback={scene.fallback}
                      alt={`${scene.label} ritual`}
                      className="editorial-image w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div
                  className={`col-span-12 md:col-span-5 ${
                    scene.imageFirst ? 'md:order-2' : 'md:order-1'
                  } ${scene.imageFirst ? 'md:pl-4' : 'md:pr-4'}`}
                >
                  <p className="text-[11px] uppercase tracking-folio text-olive mb-4">
                    {scene.label}
                  </p>
                  <p className="font-serif text-base leading-relaxed text-charcoal/75 mb-8 max-w-sm">
                    {scene.copy}
                  </p>
                  <ul className="border-t border-charcoal/15">
                    {scene.products.map((name) => {
                      const product = findProduct(name);
                      if (!product) return null;
                      return (
                        <li key={product.id} className="border-b border-charcoal/15">
                          <Link
                            to="/shop"
                            className="flex justify-between gap-4 py-4 group"
                          >
                            <span className="font-serif text-sm leading-snug text-charcoal group-hover:text-oxblood transition-colors">
                              {product.name}
                            </span>
                            <span className="text-[12px] tracking-wide text-charcoal/75 shrink-0 pt-0.5">
                              {formatPrice(product.price)}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Lumenora Journal ── */}
      <section className="bg-parchment border-b border-charcoal/10">
        <div className="mx-auto max-w-editorial px-6 md:px-10 lg:px-14 py-20 md:py-28">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-20">
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal">
              The Lumenora Journal
            </h2>
            <Link
              to="/blog"
              className="text-[11px] uppercase tracking-folio text-charcoal border-b border-charcoal/40 pb-1 hover:border-oxblood hover:text-oxblood transition-colors w-fit"
            >
              Read the Journal
            </Link>
          </div>

          <div className="editorial-reveal grid grid-cols-12 gap-10 lg:gap-14">
            {/* Primary cover story */}
            <article className="col-span-12 lg:col-span-7">
              <Link to="/blog" className="group block">
                <div className="aspect-[3/2] overflow-hidden bg-ivory mb-6">
                  <EditorialImg
                    src="/assets/generated/home-journal-primary.jpg"
                    fallback={primaryArticle.image}
                    alt={primaryArticle.title}
                    className="editorial-image w-full h-full object-cover"
                  />
                </div>
                <p className="text-[10px] uppercase tracking-folio text-brass mb-3">
                  {primaryArticle.category}
                </p>
                <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl leading-[1.2] text-charcoal group-hover:text-oxblood transition-colors max-w-xl">
                  {primaryArticle.title}
                </h3>
              </Link>
            </article>

            {/* Supporting stories */}
            <div className="col-span-12 lg:col-span-5 flex flex-col justify-center">
              {supportArticles.map((article, idx) => (
                <article
                  key={article.id}
                  className={`${idx > 0 ? 'border-t border-charcoal/15 pt-8 mt-8' : ''}`}
                >
                  <Link to="/blog" className="group grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-4 aspect-[4/3] overflow-hidden bg-ivory">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="col-span-8">
                      <p className="text-[11px] uppercase tracking-folio text-charcoal/70 mb-2">
                        {article.category}
                      </p>
                      <h3 className="font-serif text-base md:text-lg leading-snug text-charcoal group-hover:text-oxblood transition-colors">
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

      {/* ── Notes from the Beauty Desk ── */}
      <section
        aria-label="Notes from the Beauty Desk"
        className="bg-charcoal text-ivory border-b border-ivory/15"
      >
        <div className="mx-auto max-w-editorial px-6 md:px-10 lg:px-14 py-20 md:py-24">
          <div className="max-w-xl">
            <p className="text-[11px] uppercase tracking-folio text-ivory/65 mb-4">
              Notes from the Beauty Desk
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-ivory mb-4">The Edit</h2>
            <p className="font-serif italic text-base text-ivory/75 mb-10">
              Curated beauty intelligence, delivered with intention.
            </p>

            <form
              className="border-b border-ivory/25 flex items-end gap-4 pb-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <label className="flex-1 flex flex-col gap-2">
                <span className="text-[11px] uppercase tracking-folio text-ivory/65">
                  Email Address
                </span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  className="w-full bg-transparent border-none outline-none text-sm text-ivory placeholder:text-ivory/30 caret-parchment py-1"
                  placeholder=""
                />
              </label>
              <button
                type="submit"
                className="text-[11px] uppercase tracking-folio text-ivory hover:text-parchment transition-colors pb-1 shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
