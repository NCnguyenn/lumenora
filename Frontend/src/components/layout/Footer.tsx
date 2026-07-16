import { Link } from 'react-router-dom';

const footerLinks = [
  { to: '/shop', label: 'Shop' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/blog', label: 'Blog' },
  { to: '/wishlist', label: 'Wishlist' },
  { to: '/cart', label: 'Cart' },
] as const;

export function Footer() {
  return (
    <footer className="bg-charcoal text-ivory">
      <div className="mx-auto max-w-editorial px-6 md:px-10 lg:px-14 py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div>
            <Link to="/" className="inline-block mb-5">
              <span className="font-serif text-2xl md:text-3xl tracking-[0.28em] uppercase text-ivory">
                Lumenora
              </span>
            </Link>
            <p className="text-sm font-serif italic text-ivory/55 max-w-xs leading-relaxed">
              Premium botanical skincare, crafted with intention.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-[11px] font-medium uppercase tracking-folio text-ivory/70 hover:text-ivory transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-14 pt-6 border-t border-ivory/15">
          <p className="text-[10px] uppercase tracking-[0.18em] text-ivory/40">
            © 2026 LUMENORA. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
