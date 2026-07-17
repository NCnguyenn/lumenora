import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { Shop } from './Shop'

afterEach(() => {
  cleanup()
})

function renderShop(initialEntry = '/shop') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Shop />
    </MemoryRouter>,
  )
}

describe('Shop All editorial marketplace', () => {
  it('renders the compact editorial hero and discovery toolbar', () => {
    renderShop()

    expect(screen.getByRole('heading', { name: 'Shop All' })).toBeInTheDocument()
    expect(
      screen.getByRole('tablist', { name: 'Product categories' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open filters' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(screen.getByRole('combobox', { name: 'Sort products' })).toHaveValue(
      'featured',
    )
  })

  it('opens filters and applies a brand filter as a removable chip', () => {
    renderShop()

    fireEvent.click(screen.getByRole('button', { name: 'Open filters' }))
    expect(
      screen.getByRole('dialog', { name: 'Product filters' }),
    ).toBeInTheDocument()
    fireEvent.change(screen.getByRole('combobox', { name: 'Brand' }), {
      target: { value: 'COSRX' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Apply filters' }))

    expect(
      screen.getByRole('button', { name: 'Remove filter Brand: COSRX' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('changes category and sort through URL-backed controls', () => {
    renderShop('/shop?category=skin')

    expect(screen.getByRole('tab', { name: 'Skin' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    fireEvent.change(screen.getByRole('combobox', { name: 'Sort products' }), {
      target: { value: 'price-low' },
    })

    expect(screen.getByText('$8.00')).toBeInTheDocument()
  })

  it('keeps add-to-cart and wishlist actions available on product cards', () => {
    renderShop()
    const firstCard = screen.getAllByRole('article')[0]

    fireEvent.click(
      within(firstCard).getByRole('button', { name: /Add .* to cart/i }),
    )
    fireEvent.click(
      within(firstCard).getByRole('button', { name: /Add .* to wishlist/i }),
    )

    expect(
      within(firstCard).getByRole('button', {
        name: /Remove .* from wishlist/i,
      }),
    ).toBeInTheDocument()
  })
})
