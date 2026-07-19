import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Quiz } from './pages/Quiz';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { Blog } from './pages/Blog';
import { ProductDetail } from './pages/ProductDetail';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { ScrollToTopButton } from './components/ui/ScrollToTopButton';
import { Toaster } from 'sonner';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" richColors />
      <ScrollToTop />
      <ScrollToTopButton />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="blog" element={<Blog />} />
          <Route path="products/:slug" element={<ProductDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

