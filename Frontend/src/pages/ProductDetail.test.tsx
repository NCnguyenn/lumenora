import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from '../App'
import { products } from '../data/products'
import {
  getRoutinePairings,
  getSimilarProducts,
} from '../data/productSelectors'
import { useAppStore } from '../store/useAppStore'
import { ProductDetail } from './ProductDetail'

const product = products[0]

function renderProductRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="products/:slug" element={<ProductDetail />} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  localStorage.clear()
  useAppStore.setState({ cart: [], wishlist: [] })
})

afterEach(() => {
  cleanup()
  window.history.replaceState({}, '', '/')
})

describe('ProductDetail', () => {
  it('composes the complete product page for a valid slug', () => {
    renderProductRoute(`/products/${product.slug}`)

    expect(screen.getByRole('heading', { name: product.name })).toBeInTheDocument()
    const breadcrumb = screen.getByRole('navigation', { name: 'Breadcrumb' })
    expect(screen.getByRole('link', { name: 'Shop' })).toHaveAttribute(
      'href',
      '/shop',
    )
    expect(breadcrumb).toHaveTextContent('Skincare')
    expect(screen.getAllByRole('button', { name: /^View image/ })).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'Add 1 to cart' })).toBeInTheDocument()
    const highlights = screen.getByRole('region', { name: 'Product highlights' })
    expect(within(highlights).getByText('Why it works')).toBeInTheDocument()
    expect(within(highlights).getByText('How to use')).toBeInTheDocument()
    expect(within(highlights).getByText('Ingredients')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Product details' })).toBeInTheDocument()
  })

  it('renders similar and routine rails that exclude self and prefer distinct lists', () => {
    renderProductRoute(`/products/${product.slug}`)

    const similarRegion = screen.getByRole('region', { name: 'You May Also Like' })
    const routineRegion = screen.getByRole('region', { name: 'Complete the Ritual' })

    expect(
      within(similarRegion).queryByText(product.name),
    ).not.toBeInTheDocument()
    expect(
      within(routineRegion).queryByText(product.name),
    ).not.toBeInTheDocument()

    const similar = getSimilarProducts(product, 4)
    const routine = getRoutinePairings(
      product,
      4,
      similar.map((item) => item.id),
    )

    for (const item of similar) {
      expect(within(similarRegion).getByText(item.name)).toBeInTheDocument()
    }
    for (const item of routine) {
      expect(within(routineRegion).getByText(item.name)).toBeInTheDocument()
      expect(similar.map((s) => s.id)).not.toContain(item.id)
    }
  })

  it('renders a complete not-found state for an invalid slug', () => {
    renderProductRoute('/products/not-a-real-product')

    expect(
      screen.getByRole('heading', { name: 'Product Not Found' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Add \d+ to cart/ })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to Shop' })).toHaveAttribute(
      'href',
      '/shop',
    )
    expect(
      screen.queryByRole('region', { name: 'You May Also Like' }),
    ).not.toBeInTheDocument()
  })

  it('exposes SEO light metadata and Product JSON-LD for a valid slug', async () => {
    const { container } = renderProductRoute(`/products/${product.slug}`)

    await waitFor(() => {
      expect(document.title).toBe(`${product.name} | Lumenora`)
    })
    const jsonLd = container.querySelector('script[type="application/ld+json"]')
    expect(jsonLd).toBeTruthy()
    const parsed = JSON.parse(jsonLd?.textContent ?? '{}') as {
      '@type': string
      name: string
      offers: { price: string }
    }
    expect(parsed['@type']).toBe('Product')
    expect(parsed.name).toBe(product.name)
    expect(parsed.offers.price).toBe(product.price.toFixed(2))
  })

  it('sets not-found document title', async () => {
    renderProductRoute('/products/not-a-real-product')
    await waitFor(() => {
      expect(document.title).toMatch(/Product Not Found/i)
    })
  })

  it('registers the canonical product route in the application router', () => {
    window.history.pushState({}, '', `/products/${product.slug}`)

    render(<App />)

    expect(screen.getByRole('heading', { name: product.name })).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: 'You May Also Like' }),
    ).toBeInTheDocument()
  })
})
