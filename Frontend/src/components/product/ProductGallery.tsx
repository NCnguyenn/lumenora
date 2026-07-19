import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
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
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const openButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  const activeImage =
    product.images.find((image) => image.id === activeImageId) ?? product.images[0]

  const activeIndex = product.images.findIndex((image) => image.id === activeImage?.id)

  const handlePrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIndex = activeIndex > 0 ? activeIndex - 1 : product.images.length - 1;
    setActiveImageId(product.images[prevIndex].id);
  }, [activeIndex, product.images]);

  const handleNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIndex = activeIndex < product.images.length - 1 ? activeIndex + 1 : 0;
    setActiveImageId(product.images[nextIndex].id);
  }, [activeIndex, product.images]);

  const markImageFailed = (imageId: string) => {
    setFailedImageIds((current) => {
      const next = new Set(current)
      next.add(imageId)
      return next
    })
  }

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
    window.requestAnimationFrame(() => {
      openButtonRef.current?.focus()
    })
  }, [])

  useEffect(() => {
    if (!lightboxOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
    })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeLightbox()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [lightboxOpen, closeLightbox])

  const canOpenLightbox = Boolean(
    activeImage && !failedImageIds.has(activeImage.id),
  )

  const handleOpenLightbox = (imageId: string) => {
    setActiveImageId(imageId)
    setLightboxOpen(true)
  }

  return (
    <section aria-label={`${product.name} gallery`}>
      {/* Gallery Layout (Large Image + Thumbnails) */}
      <div className="flex flex-col gap-4" data-gallery-layout="mosaic">
        <div className="group relative aspect-square overflow-hidden bg-parchment">
          {product.images.map((image) => {
            const isActive = image.id === activeImage?.id
            if (failedImageIds.has(image.id)) return null

            return (
              <img
                key={image.id}
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                decoding="async"
                fetchPriority={isActive ? 'high' : 'auto'}
                onError={() => markImageFailed(image.id)}
                className={cn(
                  'absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out',
                  isActive ? 'z-10 opacity-100' : 'z-0 opacity-0',
                )}
              />
            )
          })}
          {activeImage && !failedImageIds.has(activeImage.id) ? (
            <>
              <button
                ref={openButtonRef}
                type="button"
                onClick={() => handleOpenLightbox(activeImage.id)}
                className="absolute inset-0 z-20 cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-charcoal"
                aria-label={`Open larger view: ${activeImage.alt}`}
              />
              {product.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 text-charcoal opacity-0 shadow-sm transition-opacity hover:bg-ivory focus-visible:opacity-100 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 text-charcoal opacity-0 shadow-sm transition-opacity hover:bg-ivory focus-visible:opacity-100 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="absolute inset-0 z-0 flex items-center justify-center bg-parchment text-[10px] font-medium uppercase tracking-folio text-charcoal/55">
              <span>Image unavailable</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-3" role="group" aria-label="Product images">
          {product.images.map((image, index) => {
            const isActive = image.id === activeImage?.id;
            const hasFailed = failedImageIds.has(image.id)

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveImageId(image.id)}
                aria-label={`View image ${index + 1}: ${image.alt}`}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'w-20 aspect-square overflow-hidden border bg-parchment focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal',
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
      </div>


      {/* Lightbox Modal */}
      {lightboxOpen && canOpenLightbox && activeImage ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-charcoal/80 p-4 motion-reduce:transition-none"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeLightbox()
          }}
        >
          <div className="relative flex max-h-[min(90vh,900px)] w-full max-w-3xl flex-col bg-ivory shadow-lg">
            <div className="flex items-center justify-between border-b border-charcoal/10 px-4 py-3">
              <p
                id={titleId}
                className="truncate pr-4 text-[11px] font-medium uppercase tracking-folio text-charcoal/70"
              >
                {activeImage.alt}
              </p>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeLightbox}
                aria-label="Close larger image view"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-charcoal transition-colors hover:text-oxblood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-parchment p-4 relative group">
               <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 text-charcoal opacity-0 shadow-sm transition-opacity hover:bg-ivory focus-visible:opacity-100 group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                width={activeImage.width}
                height={activeImage.height}
                className="max-h-[min(75vh,800px)] w-auto max-w-full object-contain"
              />
               <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 text-charcoal opacity-0 shadow-sm transition-opacity hover:bg-ivory focus-visible:opacity-100 group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

