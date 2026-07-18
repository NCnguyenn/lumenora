import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { products } from '../../data/products'
import { ProductHighlights } from './ProductHighlights'

afterEach(() => {
  cleanup()
})

describe('ProductHighlights', () => {
  it('groups concise product benefits into an accessible highlights region', () => {
    render(<ProductHighlights product={products[0]} />)

    const region = screen.getByRole('region', { name: 'Product highlights' })
    expect(region).toBeInTheDocument()
    expect(region).toHaveTextContent('Why it works')
    expect(region).toHaveTextContent('How to use')
    expect(region).toHaveTextContent('Ingredients')
  })
})
