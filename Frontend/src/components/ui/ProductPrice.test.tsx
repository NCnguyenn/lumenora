import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ProductPrice } from './ProductPrice'

afterEach(() => {
  cleanup()
})

describe('ProductPrice', () => {
  it('renders a regular price without comparison markup', () => {
    const { container } = render(
      <ProductPrice
        merchandising={{
          tag: 'new',
          label: 'NEW',
          price: 45,
          compareAtPrice: null,
          isSale: false,
        }}
      />,
    )

    expect(screen.getByText('$45.00')).toBeInTheDocument()
    expect(container.querySelector('del')).toBeNull()
  })

  it('uses semantic and accessible sale pricing', () => {
    render(
      <ProductPrice
        merchandising={{
          tag: 'sale',
          label: 'SALE',
          price: 26,
          compareAtPrice: 32,
          isSale: true,
        }}
      />,
    )

    expect(screen.getByText('$32.00').closest('del')).toBeInTheDocument()
    expect(screen.getByText('$26.00')).toBeInTheDocument()
    expect(screen.getByText('Original price')).toHaveClass('sr-only')
    expect(screen.getByText('Sale price')).toHaveClass('sr-only')
  })
})
