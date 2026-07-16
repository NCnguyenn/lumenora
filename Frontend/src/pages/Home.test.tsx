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
] as const

describe('Home editorial experience', () => {
  it('renders the approved editorial passages and safe destinations', () => {
    const { container } = renderHome()

    expect(screen.getByText('Compositions for the Skin')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'Many formulas.One considered ritual.',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Cleanse. Treat. Protect.')).toBeInTheDocument()
    expect(screen.getByText('The Lumenora Journal')).toBeInTheDocument()

    const allowed = new Set(['/shop', '/blog'])
    container.querySelectorAll('a[href]').forEach((link) => {
      expect(allowed.has(link.getAttribute('href') ?? '')).toBe(true)
    })
  })

  it('keeps inactive hero slides out of the accessibility tree', () => {
    renderHome()

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getAllByRole('link', { name: 'SHOP NOW' })).toHaveLength(1)
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
  })

  it('uses structured grids for categories and product compositions', () => {
    const { container } = renderHome()

    const categories = container.querySelector(
      '[data-layout="home-categories"]',
    )
    const compositions = container.querySelector(
      '[data-layout="home-compositions"]',
    )

    expect(categories).toHaveClass('lg:grid-cols-12')
    expect(compositions).toHaveClass('md:grid-cols-12')
    expect(screen.getByText('Nourish, renew and restore.')).toBeInTheDocument()
    expect(screen.getByText('Hydrate, soften and replenish.')).toBeInTheDocument()
    expect(screen.getByText('Shield skin with daily protection.')).toBeInTheDocument()
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
          100_000,
        )
      }
    })
  })
})
