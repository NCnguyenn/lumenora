import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'Customer Care',
    links: [
      { to: '/shop', label: 'Contact Concierge' },
      { to: '/quiz', label: 'Beauty Quiz' },
      { to: '/blog', label: 'Journal' },
      { to: '/wishlist', label: 'Wishlist' },
    ],
  },
  {
    title: 'Shipping & Returns',
    links: [
      { to: '/shop', label: 'Delivery' },
      { to: '/shop', label: 'Returns' },
      { to: '/shop', label: 'Order Tracking' },
      { to: '/cart', label: 'Your Cart' },
    ],
  },
  {
    title: 'About Lumenora',
    links: [
      { to: '/blog', label: 'Our Edit' },
      { to: '/shop', label: 'Brands We Carry' },
      { to: '/quiz', label: 'How We Curate' },
      { to: '/blog', label: 'Ingredients Desk' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/shop', label: 'Privacy' },
      { to: '/shop', label: 'Terms' },
      { to: '/shop', label: 'Accessibility' },
      { to: '/shop', label: 'Cookie Preferences' },
    ],
  },
] as const;

const social = [
  { href: 'https://www.instagram.com/', label: 'Instagram' },
  { href: 'https://www.pinterest.com/', label: 'Pinterest' },
  { href: 'https://www.youtube.com/', label: 'YouTube' },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-charcoal/20 bg-charcoal text-ivory">
      <div className="mx-auto max-w-editorial px-5 sm:px-6 md:px-10 lg:px-14 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link
              to="/"
              className="inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ivory"
            >
              <span className="font-serif text-2xl md:text-3xl uppercase tracking-[0.28em] text-ivory">
                Lumenora
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm font-serif italic leading-relaxed text-ivory/55">
              A curated multi-brand beauty marketplace — skincare, body, sun, and fragrance
              from independent and established houses, edited with intention.
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-[11px] font-medium uppercase tracking-folio text-ivory/65 transition-colors hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-[11px] font-medium uppercase tracking-folio text-brass">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-1">
                  {col.links.map((link) => (
                    <li key={`${col.title}-${link.label}`}>
                      <Link
                        to={link.to}
                        className="inline-flex min-h-10 items-center text-sm text-ivory/70 transition-colors hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-ivory/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] uppercase tracking-[0.18em] text-ivory/40">
            © 2026 Lumenora. All rights reserved.
          </p>
          <p className="text-[10px] uppercase tracking-[0.14em] text-ivory/35">
            Multi-brand curation · Authenticated beauty · Thoughtful shipping
          </p>
        </div>
      </div>
    </footer>
  );
}
