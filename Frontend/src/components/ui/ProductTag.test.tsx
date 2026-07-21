import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ProductTag } from './ProductTag'

afterEach(() => {
  cleanup()
})

describe('ProductTag', () => {
  it('renders the centralized uppercase label', () => {
    render(<ProductTag tag="best-seller" />)

    expect(screen.getByText('BEST SELLER')).toHaveClass(
      'bg-oxblood',
      'text-white',
      'max-w-16',
      'text-center',
      'sm:max-w-none',
    )
  })

  it('renders no wrapper for an untagged product', () => {
    const { container } = render(<ProductTag tag={null} />)

    expect(container.querySelector('[data-product-tag]')).toBeNull()
  })
})
