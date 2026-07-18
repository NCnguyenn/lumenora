import { useState } from 'react'
import type { Product } from '../../data/products'
import { cn } from '../../lib/utils'

interface ProductGalleryProps {
  product: Product
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [activeImageId, setActiveImageId] = useState(product.images[0]?.id ?? '')
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(
    () => new Set(),
  )
  const activeImage =
    product.images.find((image) => image.id === activeImageId) ?? product.images[0]

  const markImageFailed = (imageId: string) => {
    setFailedImageIds((current) => {
      const next = new Set(current)
      next.add(imageId)
      return next
    })
  }

  return (
    <section aria-label={`${product.name} gallery`}>
      <div className="aspect-square overflow-hidden bg-parchment">
        {activeImage && !failedImageIds.has(activeImage.id) ? (
          <img
            src={activeImage.src}
            alt={activeImage.alt}
            width={activeImage.width}
            height={activeImage.height}
            decoding="async"
            fetchPriority="high"
            onError={() => markImageFailed(activeImage.id)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            role="img"
            aria-label={`${product.name} image unavailable`}
            className="flex h-full items-center justify-center bg-parchment text-[10px] font-medium uppercase tracking-folio text-charcoal/55"
          >
            <span>Image unavailable</span>
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        {product.images.map((image, index) => {
          const isActive = image.id === activeImage?.id
          const hasFailed = failedImageIds.has(image.id)

          return (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveImageId(image.id)}
              aria-label={`View image ${index + 1}: ${image.alt}`}
              aria-current={isActive ? 'true' : undefined}
              className={cn(
                'aspect-square overflow-hidden border bg-parchment focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal',
                isActive ? 'border-charcoal' : 'border-charcoal/15',
              )}
            >
              {hasFailed ? (
                <span className="flex h-full items-center justify-center px-2 text-[9px] uppercase tracking-wider text-charcoal/50">
                  Unavailable
                </span>
              ) : (
                <img
                  src={image.src}
                  alt=""
                  aria-hidden="true"
                  width={image.width}
                  height={image.height}
                  loading="lazy"
                  decoding="async"
                  onError={() => markImageFailed(image.id)}
                  className="h-full w-full object-cover"
                />
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
