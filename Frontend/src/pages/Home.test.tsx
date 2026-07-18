/// <reference types="node" />

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { Home } from './Home'

afterEach(() => {
  cleanup()
})

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  )
}

const editorialAssets = [
  'home-contents-skin.jpg',
  'home-contents-body.jpg',
  'home-contents-sun.jpg',
  'home-daily-edit.jpg',
  'home-composition-serum.jpg',
  'home-composition-mask.jpg',
  'home-composition-sunscreen.jpg',
  'home-brand-interlude.jpg',
  'home-ritual-cleanse.jpg',
  'home-ritual-treat.jpg',
  'home-ritual-protect.jpg',
  'home-journal-primary.jpg',
  'hero-marketplace-1920.jpg',
] as const

describe('Home editorial experience', () => {
  it('renders the approved editorial passages and safe destinations', () => {
    const { container } = renderHome()

    expect(screen.getByText('Compositions for the Skin')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'Many houses.One considered edit.',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Cleanse. Treat. Protect.')).toBeInTheDocument()
    expect(screen.getByText('The Lumenora Journal')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Find products across brands/i })).toBeInTheDocument()

    container.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href') ?? ''
      expect(
        href.startsWith('/shop') ||
          href.startsWith('/products/') ||
          href.startsWith('/blog') ||
          href.startsWith('/quiz') ||
          href.startsWith('/wishlist') ||
          href.startsWith('/cart') ||
          href === '/',
      ).toBe(true)
    })
  })

  it('keeps inactive hero slides out of the accessibility tree', () => {
    renderHome()

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getAllByRole('link', { name: 'Shop the Edit' }).length).toBeGreaterThan(0)
  })

  it('lets visitors pause and resume the hero carousel', () => {
    renderHome()

    const pause = screen.getByRole('button', { name: 'Pause slideshow' })
    fireEvent.click(pause)
    expect(
      screen.getByRole('button', { name: 'Play slideshow' }),
    ).toBeInTheDocument()
  })

  it('exposes the newsletter as the dark closing editorial note', () => {
    renderHome()

    const note = screen.getByRole('region', {
      name: 'Notes from the Beauty Desk',
    })
    expect(note).toHaveClass('bg-charcoal', 'text-ivory')
    expect(
      within(note).getByRole('button', { name: 'Subscribe' }),
    ).toBeInTheDocument()
    expect(within(note).getByLabelText(/email address/i)).toBeInTheDocument()
  })

  it('uses the approved collection gallery and product composition grid', () => {
    const { container } = renderHome()

    const categories = container.querySelector('#home-categories')
    const categoryGrid = categories?.querySelector(':scope > .grid')
    const compositions = container.querySelector(
      '[data-layout="home-compositions"]',
    )

    expect(categoryGrid).toHaveClass('grid-cols-2', 'lg:grid-cols-4')
    expect(compositions).toHaveClass('md:grid-cols-12')
    expect(within(categories as HTMLElement).getByRole('link', { name: /Skincare/i })).toHaveAttribute(
      'href',
      '/shop?category=skin',
    )
    expect(within(categories as HTMLElement).getByRole('link', { name: /Bodycare/i })).toHaveAttribute(
      'href',
      '/shop?category=body',
    )
    expect(within(categories as HTMLElement).getByRole('link', { name: /Suncare/i })).toHaveAttribute(
      'href',
      '/shop?category=sun',
    )
  })

  it('marks editorial passages for progressive motion', () => {
    const { container } = renderHome()

    expect(container.querySelectorAll('.editorial-reveal').length).toBeGreaterThan(3)
    expect(container.querySelectorAll('.editorial-image').length).toBeGreaterThan(6)
  })

  it('ships every editorial image used by Home', () => {
    editorialAssets.forEach((filename) => {
      const path = resolve(
        process.cwd(),
        'public',
        'assets',
        'generated',
        filename,
      )

      expect(existsSync(path), `${filename} should exist`).toBe(true)
      if (existsSync(path)) {
        expect(statSync(path).size, `${filename} should be non-empty`).toBeGreaterThan(
          40_000,
        )
      }
    })
  })

  it('surfaces multi-brand product brands on the homepage', () => {
    renderHome()
    expect(screen.getAllByText('Aurelle Lab').length).toBeGreaterThan(0)
    expect(screen.getAllByText('COSRX').length).toBeGreaterThan(0)
  })
})
