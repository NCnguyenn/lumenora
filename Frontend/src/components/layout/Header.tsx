import { Link, NavLink } from 'react-router-dom';
import { Search, Heart, ShoppingBag } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

export function Header() {
  const { cart, wishlist } = useAppStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'text-[11px] font-medium uppercase tracking-folio pb-0.5 border-b transition-colors',
      isActive
        ? 'border-charcoal text-charcoal'
        : 'border-transparent text-charcoal/70 hover:text-charcoal'
    );

  return (
    <header className="sticky top-0 z-50 w-full bg-parchment border-b border-charcoal/20">
      <div className="relative mx-auto max-w-editorial px-6 md:px-10 lg:px-14">
        <div className="flex items-center justify-between py-4 md:py-5">
          {/* Primary nav — left on desktop */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/shop" className={navLinkClass}>
              Shop
            </NavLink>
            <NavLink to="/quiz" className={navLinkClass}>
              Quiz
            </NavLink>
            <NavLink to="/blog" className={navLinkClass}>
              Blog
            </NavLink>
          </nav>

          {/* Mobile: spacer so wordmark stays centered */}
          <div className="w-16 md:hidden" aria-hidden />

          <Link
            to="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <span className="font-serif text-2xl md:text-[1.65rem] tracking-[0.28em] uppercase text-charcoal">
              Lumenora
            </span>
          </Link>

          <div className="flex items-center gap-5 text-charcoal">
            <button
              type="button"
              aria-label="Search"
              className="hover:opacity-60 transition-opacity"
            >
              <Search className="w-[18px] h-[18px] stroke-[1.5]" />
            </button>
            <Link
              to="/wishlist"
              className="relative hover:opacity-60 transition-opacity"
              aria-label="Wishlist"
            >
              <Heart className="w-[18px] h-[18px] stroke-[1.5]" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-2 text-[9px] font-medium tracking-wider">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="relative hover:opacity-60 transition-opacity"
              aria-label="Cart"
            >
              <ShoppingBag className="w-[18px] h-[18px] stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 text-[9px] font-medium tracking-wider">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="flex md:hidden justify-center items-center gap-6 pb-3 -mt-1">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/shop" className={navLinkClass}>
            Shop
          </NavLink>
          <NavLink to="/quiz" className={navLinkClass}>
            Quiz
          </NavLink>
          <NavLink to="/blog" className={navLinkClass}>
            Blog
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
