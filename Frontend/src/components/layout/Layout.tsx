import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-charcoal focus:px-4 focus:py-3 focus:text-sm focus:text-ivory focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-ivory"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-grow" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
