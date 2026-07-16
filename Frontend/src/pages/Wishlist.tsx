import { useAppStore } from '../store/useAppStore';
import { products } from '../data/products';
import { ProductCard } from '../components/ui/ProductCard';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function Wishlist() {
  const { wishlist } = useAppStore();
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="bg-[#F8F6F4] min-h-[70vh] py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto w-full flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-border pb-8">
          <h1 className="text-3xl md:text-4xl font-serif mb-6 md:mb-0">My Wishlist <span className="text-muted italic text-2xl">({wishlist.length})</span></h1>
          
          <div className="flex items-center border-b border-border w-full md:w-64 pb-2">
            <Search className="w-4 h-4 text-muted mr-2" />
            <input 
              type="text" 
              placeholder="Search wishlist..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
        </div>

        {wishlist.length === 0 ? (
           <div className="text-center py-24">
           <p className="text-muted mb-6 font-serif text-lg">Your wishlist is currently empty.</p>
           <Link to="/shop">
             <Button>DISCOVER PRODUCTS</Button>
           </Link>
         </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-16">
            {wishlistedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

