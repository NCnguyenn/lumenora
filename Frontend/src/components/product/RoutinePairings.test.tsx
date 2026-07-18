import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import {
  getProductById,
  getRoutinePairings,
  getSimilarProducts,
} from '../../data/productSelectors'
import { RoutinePairings } from './RoutinePairings'

afterEach(() => {
  cleanup()
})

describe('RoutinePairings', () => {
  it('renders Complete the Ritual with cards linking to PDP and excludes self', () => {
    const product = getProductById('p1')
    expect(product).toBeDefined()
    if (!product) return

    const routine = getRoutinePairings(product, 4)
    expect(routine.length).toBeGreaterThan(0)

    render(
      <MemoryRouter>
        <RoutinePairings product={product} />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('region', { name: 'Complete the Ritual' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Complete the Ritual' }),
    ).toBeInTheDocument()

    for (const item of routine) {
      expect(item.id).not.toBe(product.id)
      expect(screen.getByText(item.name)).toBeInTheDocument()
      const links = screen.getAllByRole('link', { name: item.name })
      expect(links[0]).toHaveAttribute('href', `/products/${item.slug}`)
    }
  })

  it('avoids products already used in the similar rail when excludeIds is set', () => {
    const product = getProductById('p1')
    expect(product).toBeDefined()
    if (!product) return

    const similar = getSimilarProducts(product, 4)
    const similarIds = similar.map((p) => p.id)
    const routine = getRoutinePairings(product, 4, similarIds)

    for (const item of routine) {
      expect(similarIds).not.toContain(item.id)
    }

    if (routine.length === 0) return

    render(
      <MemoryRouter>
        <RoutinePairings product={product} excludeIds={similarIds} />
      </MemoryRouter>,
    )

    for (const item of similar) {
      expect(screen.queryByText(item.name)).not.toBeInTheDocument()
    }
    for (const item of routine) {
      expect(screen.getByText(item.name)).toBeInTheDocument()
    }
  })
})
