import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { getBrandById } from '../../data/productSelectors'
import { products } from '../../data/products'
import { ProductDetailsAccordion } from './ProductDetailsAccordion'

const product = products[0]
const brand = getBrandById(product.brandId)

afterEach(() => {
  cleanup()
})

describe('ProductDetailsAccordion', () => {
  it('renders all catalog detail sections with Overview open initially', () => {
    render(<ProductDetailsAccordion product={product} brand={brand} />)

    expect(screen.getByText('Overview').closest('details')).toHaveAttribute('open')
    expect(screen.getByText('Key ingredients')).toBeInTheDocument()
    expect(screen.getByText('Full ingredients')).toBeInTheDocument()
    expect(screen.getByText('How to use')).toBeInTheDocument()
    expect(screen.getByText('Product facts & care')).toBeInTheDocument()
    expect(screen.getByText('Brand story')).toBeInTheDocument()
    expect(screen.getByText('Shipping & returns')).toBeInTheDocument()

    expect(screen.getByText(product.description[0])).toBeInTheDocument()
    expect(screen.getByText(product.benefits[0])).toBeInTheDocument()
    expect(screen.getByText(product.keyIngredients[0].name)).toBeInTheDocument()
    expect(screen.getByText(product.keyIngredients[0].benefit)).toBeInTheDocument()
    expect(screen.getByText(product.fullIngredients)).toBeInTheDocument()
  })

  it('uses semantic lists and includes facts, care, brand, and policies', () => {
    render(<ProductDetailsAccordion product={product} brand={brand} />)

    const steps = screen.getByRole('list', { name: 'How to use steps' })
    expect(steps.children).toHaveLength(product.howToUse.length)
    expect(screen.getByText(product.routineStep)).toBeInTheDocument()
    expect(screen.getByText(product.warnings[0])).toBeInTheDocument()
    expect(screen.getByText(brand!.shortStory)).toBeInTheDocument()
    expect(screen.getByText(product.shippingNote)).toBeInTheDocument()
    expect(screen.getByText(product.returnNote)).toBeInTheDocument()
  })
})
