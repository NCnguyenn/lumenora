import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductDetailsAccordion } from '../components/product/ProductDetailsAccordion'
import { ProductGallery } from '../components/product/ProductGallery'
import { ProductInfoPanel } from '../components/product/ProductInfoPanel'
import { QuickInfoGrid } from '../components/product/QuickInfoGrid'
import { RoutinePairings } from '../components/product/RoutinePairings'
import { SimilarProducts } from '../components/product/SimilarProducts'
import type { Product } from '../data/types'
import {
  categoryLabel,
  getBrandById,
  getPrimaryImage,
  getProductBySlug,
  getSimilarProducts,
} from '../data/productSelectors'

const DEFAULT_DOCUMENT_TITLE = 'Lumenora'

function useDocumentMeta(title: string, description: string) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const created = !meta
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    const previousDescription = meta.content
    meta.content = description

    return () => {
      document.title = previousTitle || DEFAULT_DOCUMENT_TITLE
      if (meta) {
        if (created) meta.remove()
        else meta.content = previousDescription
      }
    }
  }, [title, description])
}

function ProductJsonLd({ product }: { product: Product }) {
  const image = getPrimaryImage(product)
  const origin =
    typeof window !== 'undefined' ? window.location.origin : ''
  const imageUrl = image?.src
    ? image.src.startsWith('http')
      ? image.src
      : `${origin}${image.src}`
    : undefined

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    sku: product.variants[0]?.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    image: imageUrl ? [imageUrl] : undefined,
    offers: {
      '@type': 'Offer',
      url: origin ? `${origin}/products/${product.slug}` : `/products/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price.toFixed(2),
      availability: product.variants.some((variant) => variant.inStock)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating.value,
      reviewCount: product.rating.count,
      // Demo ratings — not claimed as official brand scores
      description: 'Demo marketplace rating',
    },
  }

  return (
    <script
      type="application/ld+json"
      // React 19 allows script tags in the tree for structured data
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

function ProductNotFound() {
  useDocumentMeta(
    'Product Not Found | Lumenora',
    'This product is not in the current Lumenora catalog. Return to Shop to browse the edit.',
  )

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-ivory px-5 py-20 text-center sm:px-6">
      <title>Product Not Found | Lumenora</title>
      <meta
        name="description"
        content="This product is not in the current Lumenora catalog. Return to Shop to browse the edit."
      />
      <div className="max-w-lg">
        <p className="text-[10px] font-medium uppercase tracking-folio text-brass">
          Lumenora Catalog
        </p>
        <h1 className="mt-5 font-serif text-4xl text-charcoal md:text-5xl">
          Product Not Found
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-charcoal/65">
          This product may have moved or is no longer part of the current edit.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex min-h-11 items-center justify-center border border-charcoal bg-charcoal px-7 text-[10px] font-medium uppercase tracking-folio text-ivory transition-colors hover:bg-oxblood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
        >
          Back to Shop
        </Link>
      </div>
    </section>
  )
}

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const product = slug ? getProductBySlug(slug) : undefined

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slug])

  if (!product) {
    return <ProductNotFound />
  }

  return <ProductDetailContent product={product} />
}

function ProductDetailContent({ product }: { product: Product }) {
  const brand = getBrandById(product.brandId)
  // Similar resolves first; routine excludes those ids so rails stay distinct.
  const similarIds = getSimilarProducts(product, 4).map((item) => item.id)

  useDocumentMeta(`${product.name} | Lumenora`, product.shortDescription)

  return (
    <article className="bg-ivory text-charcoal">
      <title>{`${product.name} | Lumenora`}</title>
      <meta name="description" content={product.shortDescription} />
      <link rel="canonical" href={`/products/${product.slug}`} />
      <ProductJsonLd product={product} />

      {/* pb-36 on small screens reserves room for sticky mobile ATC */}
      <div className="mx-auto max-w-editorial px-5 pb-36 pt-6 sm:px-6 md:px-10 md:pb-28 lg:px-14 lg:pb-28">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wider text-charcoal/55"
        >
          <Link
            to="/shop"
            className="transition-colors hover:text-oxblood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
          >
            Shop
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            to={`/shop?category=${product.category}`}
            className="transition-colors hover:text-oxblood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
          >
            {categoryLabel(product.category)}
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-charcoal/75">
            {product.name}
          </span>
        </nav>

        <div className="mt-7 grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <ProductGallery key={product.id} product={product} />
          </div>
          <div className="lg:col-span-5 flex flex-col lg:sticky lg:top-24">
            <ProductInfoPanel key={product.id} product={product} />
          </div>
        </div>

        <div className="mt-16 max-w-5xl mx-auto lg:mt-24 border border-charcoal/10 rounded-sm bg-ivory">
          <QuickInfoGrid />
          <ProductDetailsAccordion product={product} brand={brand} />
        </div>

        <div className="mt-4 space-y-4">
          <SimilarProducts product={product} />
          <RoutinePairings product={product} excludeIds={similarIds} />
        </div>
      </div>
    </article>
  )
}
