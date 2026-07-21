import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { products } from '../../data/products'
import { QuizProductCard } from './QuizProductCard'

afterEach(() => {
  cleanup()
})

describe('QuizProductCard', () => {
  it('links to the PDP and renders synchronized sale merchandising', () => {
    const product = products.find((item) => item.id === 'p11')!

    render(
      <MemoryRouter>
        <QuizProductCard
          product={product}
          stepNumber={4}
          stepName="Protect"
        />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', {
      name: (accessibleName) => accessibleName.includes(product.name),
    })).toHaveAttribute(
      'href',
      `/products/${product.slug}`,
    )
    expect(screen.getByText('SALE')).toBeInTheDocument()
    expect(screen.getByText(product.name)).toBeInTheDocument()
    expect(screen.getByText('$31.00').closest('del')).toBeInTheDocument()
    expect(screen.getByText('$24.80')).toBeInTheDocument()
  })
})
