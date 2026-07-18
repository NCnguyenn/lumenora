import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { getProductById, getSimilarProducts } from '../../data/productSelectors'
import { SimilarProducts } from './SimilarProducts'

afterEach(() => {
  cleanup()
})

describe('SimilarProducts', () => {
  it('renders the You May Also Like rail with ProductCard links to PDP', () => {
    const product = getProductById('p1')
    expect(product).toBeDefined()
    if (!product) return

    const similar = getSimilarProducts(product, 4)
    expect(similar.length).toBeGreaterThan(0)

    render(
      <MemoryRouter>
        <SimilarProducts product={product} />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('region', { name: 'You May Also Like' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'You May Also Like' }),
    ).toBeInTheDocument()

    for (const item of similar) {
      expect(screen.getByText(item.name)).toBeInTheDocument()
      const links = screen.getAllByRole('link', { name: item.name })
      expect(links[0]).toHaveAttribute('href', `/products/${item.slug}`)
    }

    expect(screen.queryByText(product.name)).not.toBeInTheDocument()
  })
})
