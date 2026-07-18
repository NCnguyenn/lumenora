import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { products } from '../../data/products'
import { ProductGallery } from './ProductGallery'

const product = products[0]

afterEach(() => {
  cleanup()
})

describe('ProductGallery', () => {
  it('renders three scenes and lets visitors select the active image', () => {
    render(<ProductGallery product={product} />)

    expect(
      screen.getByRole('img', { name: product.images[0].alt }),
    ).toHaveAttribute('src', product.images[0].src)

    const thumbnails = screen.getAllByRole('button', { name: /^View image/ })
    expect(thumbnails).toHaveLength(3)
    expect(thumbnails[0]).toHaveAttribute('aria-current', 'true')

    fireEvent.click(thumbnails[2])

    expect(thumbnails[0]).not.toHaveAttribute('aria-current')
    expect(thumbnails[2]).toHaveAttribute('aria-current', 'true')
    expect(
      screen.getByRole('img', { name: product.images[2].alt }),
    ).toHaveAttribute('src', product.images[2].src)
  })

  it('replaces a failed active scene without retrying the broken image', () => {
    const { container } = render(<ProductGallery product={product} />)
    const thumbnails = screen.getAllByRole('button', { name: /^View image/ })
    fireEvent.click(thumbnails[2])

    fireEvent.error(
      screen.getByRole('img', { name: product.images[2].alt }),
    )

    expect(screen.getByText('Image unavailable')).toBeInTheDocument()
    expect(
      container.querySelector(`img[src="${product.images[2].src}"]`),
    ).toBeNull()
  })
})
