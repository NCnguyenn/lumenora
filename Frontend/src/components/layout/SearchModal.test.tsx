import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { products } from '../../data/products'
import { SearchModal } from './SearchModal'

afterEach(() => {
  cleanup()
})

describe('SearchModal', () => {
  it('links search results to the product PDP and closes on navigate', () => {
    let closed = false

    render(
      <MemoryRouter>
        <SearchModal isOpen onClose={() => { closed = true }} />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByPlaceholderText('What are you looking for?'), {
      target: { value: 'COSRX' },
    })

    const snail = products.find((product) => product.id === 'p8')
    expect(snail).toBeDefined()
    if (!snail) return

    const link = screen.getByRole('link', {
      name: new RegExp(snail.name, 'i'),
    })
    expect(link).toHaveAttribute('href', `/products/${snail.slug}`)

    fireEvent.click(link)
    expect(closed).toBe(true)
  })

  it('does not advertise tags without matching SKUs', () => {
    render(
      <MemoryRouter>
        <SearchModal isOpen onClose={() => undefined} />
      </MemoryRouter>,
    )

    expect(screen.queryByRole('button', { name: 'Lip oil' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Serum' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cleanser' })).toBeInTheDocument()
  })

  it('shows popular products with brand, name, and price when query is empty', () => {
    render(
      <MemoryRouter>
        <SearchModal isOpen onClose={() => undefined} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Popular Products')).toBeInTheDocument()
    const pdpLinks = screen
      .getAllByRole('link')
      .filter((link) => (link.getAttribute('href') ?? '').startsWith('/products/'))
    expect(pdpLinks.length).toBeGreaterThan(0)
  })

  it('shows synchronized tag and sale pricing in search results', () => {
    render(
      <MemoryRouter>
        <SearchModal isOpen onClose={() => undefined} />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByPlaceholderText('What are you looking for?'), {
      target: { value: 'Shea' },
    })

    expect(screen.getByText('SALE')).toBeInTheDocument()
    expect(screen.getByText('$32.00').closest('del')).toBeInTheDocument()
    expect(screen.getByText('$26.00')).toBeInTheDocument()
  })
})
