import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { X } from 'lucide-react'
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

  const markImageFailed = (imageId: string) => {
    setFailedImageIds((current) => {
      const next = new Set(current)
      next.add(imageId)
      return next
    })
  }

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
    // Return focus to the control that opened the dialog
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

  return (
    <section aria-label={`${product.name} gallery`}>
      <div className="relative aspect-square overflow-hidden bg-parchment">
        {activeImage && !failedImageIds.has(activeImage.id) ? (
          <>
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
            <button
              ref={openButtonRef}
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="absolute inset-0 cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-charcoal"
              aria-label={`Open larger view: ${activeImage.alt}`}
            />
          </>
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

      <div
        className="mt-3 grid grid-cols-3 gap-3"
        role="group"
        aria-label="Product images"
      >
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
                'aspect-square min-h-11 overflow-hidden border bg-parchment focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal',
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
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-parchment p-4">
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                width={activeImage.width}
                height={activeImage.height}
                className="max-h-[min(75vh,800px)] w-auto max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
