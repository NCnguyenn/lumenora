import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { products } from '../../data/products'
import type { Product } from '../../data/products'
import { useAppStore } from '../../store/useAppStore'
import { ProductInfoPanel } from './ProductInfoPanel'

const product = products[0]

beforeEach(() => {
  localStorage.clear()
  useAppStore.setState({ cart: [], wishlist: [] })
})

afterEach(() => {
  cleanup()
})

describe('ProductInfoPanel', () => {
  it('renders purchase information and connects cart and wishlist actions', () => {
    render(<ProductInfoPanel product={product} />)

    expect(screen.getByRole('heading', { name: product.name })).toBeInTheDocument()
    expect(screen.getByText(product.subtitle)).toBeInTheDocument()
    expect(screen.getAllByText('$45.00')[0]).toBeInTheDocument()
    expect(screen.getAllByText(product.variants[0].size)[0]).toBeInTheDocument()
    expect(screen.getByText('Free shipping over $50')).toBeInTheDocument()
    expect(
      screen.getByLabelText('Rated 4.8 out of 5 from 310 reviews'),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Increase quantity' }))
    fireEvent.click(screen.getByRole('button', { name: 'Add 2 to cart' }))

    expect(useAppStore.getState().cart[0]).toMatchObject({
      productId: product.id,
      variantId: product.variants[0].id,
      quantity: 2,
    })
    expect(
      screen.getByRole('status', {
        name: `Added 2 ${product.name} to cart. Confirmation 1`,
      }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Add 2 to cart' }))
    expect(
      screen.getByRole('status', {
        name: `Added 2 ${product.name} to cart. Confirmation 2`,
      }),
    ).toBeInTheDocument()
    expect(useAppStore.getState().cart[0].quantity).toBe(4)

    fireEvent.click(
      screen.getByRole('button', {
        name: `Add ${product.name} to wishlist`,
      }),
    )
    expect(useAppStore.getState().wishlist).toContain(product.id)
    expect(
      screen.getByRole('button', {
        name: `Remove ${product.name} from wishlist`,
      }),
    ).toHaveAttribute('aria-pressed', 'true')
  })

  it('constrains quantity between one and ten', () => {
    render(<ProductInfoPanel product={product} />)
    const increase = screen.getByRole('button', { name: 'Increase quantity' })
    const decrease = screen.getByRole('button', { name: 'Decrease quantity' })

    for (let index = 0; index < 12; index += 1) fireEvent.click(increase)
    expect(screen.getByLabelText('Quantity')).toHaveTextContent('10')
    expect(increase).toBeDisabled()

    for (let index = 0; index < 12; index += 1) fireEvent.click(decrease)
    expect(screen.getByLabelText('Quantity')).toHaveTextContent('1')
    expect(decrease).toBeDisabled()
  })

  it('selects the declared default variant and updates price by selection', () => {
    const firstVariant = product.variants[0]
    const secondVariant = {
      ...firstVariant,
      id: 'AL-TON-BAM-300',
      label: '300 ml',
      size: '300 ml',
      price: 72,
      sku: 'AL-TON-BAM-300',
    }
    const multiVariantProduct: Product = {
      ...product,
      variants: [firstVariant, secondVariant],
      defaultVariantId: secondVariant.id,
      price: secondVariant.price,
    }

    render(<ProductInfoPanel product={multiVariantProduct} />)

    const defaultChoice = screen.getByRole('radio', {
      name: '300 ml — $72.00',
    })
    expect(defaultChoice).toBeChecked()
    expect(defaultChoice.closest('label')).toHaveClass(
      'focus-within:ring-2',
      'focus-within:ring-offset-2',
    )
    expect(screen.getByText('$72.00', { selector: '[data-product-price]' })).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('radio', { name: '150 ml — $45.00' }),
    )
    expect(screen.getByText('$45.00', { selector: '[data-product-price]' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Add 1 to cart' }))
    expect(useAppStore.getState().cart[0]).toMatchObject({
      productId: multiVariantProduct.id,
      variantId: firstVariant.id,
      quantity: 1,
    })
  })

  it('disables unavailable variants and products without variants', () => {
    const unavailableVariant = {
      ...product.variants[0],
      inStock: false,
    }
    const unavailableProduct: Product = {
      ...product,
      variants: [unavailableVariant],
      defaultVariantId: unavailableVariant.id,
    }
    const { unmount } = render(
      <ProductInfoPanel product={unavailableProduct} />,
    )

    expect(screen.getByText('Out of stock')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add 1 to cart' })).toBeDisabled()

    unmount()
    render(
      <ProductInfoPanel
        product={{ ...product, variants: [], defaultVariantId: '' }}
      />,
    )
    expect(screen.getByText('Unavailable')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add 1 to cart' })).toBeDisabled()
  })

  it('keeps sticky mobile ATC labelled and out of the a11y tree when hidden', () => {
    render(<ProductInfoPanel product={product} />)

    const sticky = document.querySelector('[data-sticky-atc]')
    expect(sticky).toBeTruthy()
    expect(sticky).toHaveAttribute('data-visible', 'false')
    expect(sticky).toHaveAttribute('aria-hidden', 'true')

    // Primary ATC stays compact-labelled; sticky uses product-qualified label when queryable
    expect(
      screen.getByRole('button', { name: 'Add 1 to cart' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', {
        name: `Add 1 ${product.name} to cart`,
      }),
    ).not.toBeInTheDocument()
  })
})
