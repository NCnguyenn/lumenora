import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Heart, Menu, ShoppingBag, X, Search } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';
import { SearchModal } from './SearchModal';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/blog', label: 'Blog' },
] as const;

const iconBtnClass =
  'relative inline-flex h-11 w-11 items-center justify-center text-charcoal transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal';

export function Header() {
  const { cart, wishlist } = useAppStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'relative inline-flex min-h-11 min-w-11 items-center justify-center px-1 text-[11px] font-medium uppercase tracking-folio transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-charcoal',
      'after:absolute after:bottom-1.5 after:left-0 after:h-[1.5px] after:w-full after:origin-left after:bg-charcoal after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100',
      isActive
        ? 'text-charcoal after:scale-x-100'
        : 'text-charcoal/70 hover:text-charcoal after:scale-x-0'
    );

  const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex min-h-12 items-center border-b border-charcoal/10 text-sm font-medium uppercase tracking-folio transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal',
      isActive ? 'text-charcoal' : 'text-charcoal/75 hover:text-charcoal'
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-charcoal/20 bg-parchment">
      <div className="mx-auto max-w-editorial px-5 sm:px-6 md:px-10 lg:px-14">
        {/* Desktop: three-column bar — nav | logo | icons */}
        <div className="hidden h-[4.25rem] items-center lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <nav className="flex items-center gap-8 xl:gap-10" aria-label="Primary">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={'end' in item ? item.end : undefined}
                className={navLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Link
            to="/"
            className="justify-self-center px-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-charcoal"
          >
            <span className="font-serif text-[1.65rem] uppercase tracking-[0.28em] text-charcoal">
              Lumenora
            </span>
          </Link>

          <div className="flex items-center justify-end gap-1 text-charcoal">
            <button
              type="button"
              className={iconBtnClass}
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
            >
              <Search className="h-[18px] w-[18px] stroke-[1.5]" aria-hidden />
            </button>
            <Link
              to="/wishlist"
              className={iconBtnClass}
              aria-label={
                wishlist.length > 0
                  ? `Wishlist, ${wishlist.length} items`
                  : 'Wishlist'
              }
            >
              <Heart className="h-[18px] w-[18px] stroke-[1.5]" aria-hidden />
              {wishlist.length > 0 && (
                <span className="absolute right-1 top-1 text-[9px] font-medium tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className={iconBtnClass}
              aria-label={
                cartCount > 0 ? `Cart, ${cartCount} items` : 'Cart'
              }
            >
              <ShoppingBag className="h-[18px] w-[18px] stroke-[1.5]" aria-hidden />
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 text-[9px] font-medium tabular-nums">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Tablet & mobile: hamburger | logo | icons */}
        <div className="relative flex h-16 items-center justify-between lg:hidden">
          <button
            type="button"
            className={iconBtnClass}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <X className="h-5 w-5 stroke-[1.5]" aria-hidden />
            ) : (
              <Menu className="h-5 w-5 stroke-[1.5]" aria-hidden />
            )}
          </button>

          <Link
            to="/"
            className="absolute left-1/2 top-1/2 z-10 flex min-h-11 -translate-x-1/2 -translate-y-1/2 items-center px-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-charcoal"
          >
            <span className="font-serif text-xl uppercase tracking-[0.2em] text-charcoal sm:text-2xl sm:tracking-[0.28em]">
              Lumenora
            </span>
          </Link>

          <div className="flex items-center gap-0.5 text-charcoal">
            <button
              type="button"
              className={iconBtnClass}
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
            >
              <Search className="h-[18px] w-[18px] stroke-[1.5]" aria-hidden />
            </button>
            <Link
              to="/wishlist"
              className={iconBtnClass}
              aria-label={
                wishlist.length > 0
                  ? `Wishlist, ${wishlist.length} items`
                  : 'Wishlist'
              }
            >
              <Heart className="h-[18px] w-[18px] stroke-[1.5]" aria-hidden />
              {wishlist.length > 0 && (
                <span className="absolute right-1 top-1 text-[9px] font-medium tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className={iconBtnClass}
              aria-label={
                cartCount > 0 ? `Cart, ${cartCount} items` : 'Cart'
              }
            >
              <ShoppingBag className="h-[18px] w-[18px] stroke-[1.5]" aria-hidden />
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 text-[9px] font-medium tabular-nums">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile / tablet drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <button
            type="button"
            className="absolute inset-0 bg-charcoal/40"
            aria-label="Close menu overlay"
            onClick={() => setMenuOpen(false)}
          />
          <div
            id={menuId}
            className="absolute left-0 top-0 flex h-full w-[min(20rem,88vw)] flex-col border-r border-charcoal/15 bg-parchment shadow-xl"
          >
            <div className="flex h-16 items-center justify-between border-b border-charcoal/15 px-4">
              <span className="font-serif text-lg uppercase tracking-[0.22em] text-charcoal">
                Menu
              </span>
              <button
                ref={closeBtnRef}
                type="button"
                className={iconBtnClass}
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                <X className="h-5 w-5 stroke-[1.5]" aria-hidden />
              </button>
            </div>
            <nav className="flex flex-col px-6 py-4" aria-label="Mobile primary">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={'end' in item ? item.end : undefined}
                  className={mobileNavClass}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              <Link
                to="/shop?sort=new"
                className="mt-6 inline-flex min-h-12 items-center justify-center border border-charcoal bg-charcoal px-6 text-[11px] font-medium uppercase tracking-folio text-ivory transition-colors hover:bg-oxblood hover:border-oxblood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
                onClick={() => setMenuOpen(false)}
              >
                Discover New Arrivals
              </Link>
              <Link
                to="/quiz"
                className="mt-3 inline-flex min-h-12 items-center justify-center border border-charcoal/30 px-6 text-[11px] font-medium uppercase tracking-folio text-charcoal transition-colors hover:border-oxblood hover:text-oxblood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
                onClick={() => setMenuOpen(false)}
              >
                Find Your Ritual
              </Link>
            </nav>
            <p className="mt-auto border-t border-charcoal/10 px-6 py-6 text-sm font-serif italic text-charcoal/65">
              A curated multi-brand beauty marketplace.
            </p>
          </div>
        </div>
      )}

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
