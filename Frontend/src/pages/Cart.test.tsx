import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { products } from '../data/products'
import { formatPrice } from '../data/productSelectors'
import { useAppStore } from '../store/useAppStore'
import { Cart } from './Cart'

const product = products[0]

beforeEach(() => {
  localStorage.clear()
  useAppStore.setState({
    cart: [
      {
        productId: product.id,
        variantId: product.defaultVariantId,
        quantity: 2,
      },
    ],
    wishlist: [],
  })
})

afterEach(() => {
  cleanup()
})

describe('Cart', () => {
  it('resolves live catalog data and links name/image to PDP', () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>,
    )

    expect(screen.getByText(product.brand)).toBeInTheDocument()
    const nameLink = screen.getByRole('link', { name: product.name })
    expect(nameLink).toHaveAttribute('href', `/products/${product.slug}`)
    expect(screen.getByText(formatPrice(product.price))).toBeInTheDocument()
    expect(
      screen.getAllByText(formatPrice(product.price * 2)).length
    ).toBeGreaterThan(0)
  })

  it('updates quantity and removes lines from the store', () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>,
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: `Increase quantity of ${product.name}`,
      }),
    )
    expect(useAppStore.getState().cart[0].quantity).toBe(3)

    fireEvent.click(screen.getByRole('button', { name: /Remove/i }))
    expect(useAppStore.getState().cart).toEqual([])
    expect(screen.getByText(/cart is currently empty/i)).toBeInTheDocument()
  })
})
