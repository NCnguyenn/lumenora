import { Link, useParams } from 'react-router-dom'
import { ProductDetailsAccordion } from '../components/product/ProductDetailsAccordion'
import { ProductGallery } from '../components/product/ProductGallery'
import { ProductInfoPanel } from '../components/product/ProductInfoPanel'
import { RoutinePairings } from '../components/product/RoutinePairings'
import { SimilarProducts } from '../components/product/SimilarProducts'
import {
  categoryLabel,
  getBrandById,
  getProductBySlug,
  getSimilarProducts,
} from '../data/productSelectors'

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const product = slug ? getProductBySlug(slug) : undefined

  if (!product) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-ivory px-5 py-20 text-center sm:px-6">
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
            className="mt-8 inline-flex min-h-11 items-center justify-center border border-charcoal bg-charcoal px-7 text-[10px] font-medium uppercase tracking-folio text-ivory transition-colors hover:bg-oxblood"
          >
            Back to Shop
          </Link>
        </div>
      </section>
    )
  }

  const brand = getBrandById(product.brandId)
  // Similar resolves first; routine excludes those ids so rails stay distinct.
  const similarIds = getSimilarProducts(product, 4).map((item) => item.id)

  return (
    <article className="bg-ivory text-charcoal">
      <title>{product.name} | Lumenora</title>
      <meta name="description" content={product.shortDescription} />
      <link rel="canonical" href={`/products/${product.slug}`} />

      <div className="mx-auto max-w-editorial px-5 pb-20 pt-6 sm:px-6 md:px-10 lg:px-14 lg:pb-28">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wider text-charcoal/55"
        >
          <Link to="/shop" className="transition-colors hover:text-oxblood">
            Shop
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            to={`/shop?category=${product.category}`}
            className="transition-colors hover:text-oxblood"
          >
            {categoryLabel(product.category)}
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-charcoal/75">
            {product.name}
          </span>
        </nav>

        <div className="mt-7 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <ProductGallery key={product.id} product={product} />
          </div>
          <div className="lg:col-span-5">
            <ProductInfoPanel key={product.id} product={product} />
          </div>
        </div>

        <div className="mt-16 max-w-4xl lg:mt-24">
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
