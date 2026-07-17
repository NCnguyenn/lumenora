import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { SearchModal } from './SearchModal'

afterEach(() => {
  cleanup()
})

describe('SearchModal', () => {
  it('preserves the typed query when linking to Shop results', () => {
    render(
      <MemoryRouter>
        <SearchModal isOpen onClose={() => undefined} />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByPlaceholderText('What are you looking for?'), {
      target: { value: 'COSRX' },
    })

    expect(
      screen.getByRole('link', {
        name: /Advanced Snail Mucin 96% Power Repairing Essence Serum/i,
      }),
    ).toHaveAttribute('href', '/shop?q=COSRX&category=skin')
  })
})
