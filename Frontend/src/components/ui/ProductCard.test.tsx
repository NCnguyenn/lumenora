import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { products } from '../../data/products'
import { useAppStore } from '../../store/useAppStore'
import { ProductCard } from './ProductCard'

const product = products[0]

function renderCard() {
  return render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  localStorage.clear()
  useAppStore.setState({ cart: [], wishlist: [] })
})

afterEach(() => {
  cleanup()
})

describe('ProductCard', () => {
  it('renders complete product information and canonical PDP links', () => {
    renderCard()

    expect(screen.getByText(product.brand)).toBeInTheDocument()
    expect(screen.getByText(product.name)).toBeInTheDocument()
    expect(screen.getByText(product.productType)).toBeInTheDocument()
    expect(screen.getByText(product.variants[0].size)).toBeInTheDocument()
    expect(screen.getByText('$45.00')).toBeInTheDocument()
    expect(screen.getByText('New')).toBeInTheDocument()
    expect(
      screen.getByLabelText('Rated 4.8 out of 5 from 310 reviews'),
    ).toBeInTheDocument()

    const productLinks = screen.getAllByRole('link')
    expect(productLinks).toHaveLength(2)
    for (const link of productLinks) {
      expect(link).toHaveAttribute('href', `/products/${product.slug}`)
    }
  })

  it('renders primary and hover scenes and removes a failed hover scene', () => {
    const { container } = renderCard()

    const primaryImage = screen.getByAltText(product.images[0].alt)
    expect(primaryImage).toHaveAttribute('src', product.images[0].src)
    expect(primaryImage).toHaveClass(
      '[@media(hover:hover)]:group-hover/image:opacity-0',
    )

    const hoverImage = container.querySelector<HTMLImageElement>(
      'img[aria-hidden="true"]',
    )
    expect(hoverImage).toHaveAttribute('src', product.images[1].src)

    fireEvent.error(hoverImage!)

    expect(
      container.querySelector('img[aria-hidden="true"]'),
    ).not.toBeInTheDocument()
    expect(primaryImage).toBeInTheDocument()
    expect(primaryImage).not.toHaveClass(
      '[@media(hover:hover)]:group-hover/image:opacity-0',
    )
  })

  it('keeps wishlist and quick-add actions connected to the store', () => {
    renderCard()

    fireEvent.click(
      screen.getByRole('button', {
        name: `Add ${product.name} to wishlist`,
      }),
    )
    expect(useAppStore.getState().wishlist).toContain(product.id)

    fireEvent.click(
      screen.getByRole('button', { name: `Add ${product.name} to cart` }),
    )
    expect(useAppStore.getState().cart[0]).toMatchObject({
      productId: product.id,
      variantId: product.defaultVariantId,
      quantity: 1,
    })
  })

  it('does not nest action buttons inside product links', () => {
    renderCard()

    for (const button of screen.getAllByRole('button')) {
      expect(button.closest('a')).toBeNull()
    }
  })
})
