import { useState } from 'react';
import { products } from '../data/products';
import { ProductCard } from '../components/ui/ProductCard';
import { ChevronDown } from 'lucide-react';

export function Shop() {
  const [activeTab, setActiveTab] = useState<'all' | 'skin' | 'body' | 'sun'>('all');

  const filteredProducts = activeTab === 'all' 
    ? products 
    : products.filter(p => p.category === activeTab);

  return (
    <div className="flex flex-col">
      <div className="bg-[#F8F6F4] pt-24 pb-6 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto w-full">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4">The Complete Selection</p>
          <h1 className="text-7xl md:text-9xl font-serif mb-8 text-primary leading-none">Shop All</h1>
          <div className="flex justify-between items-end">
            <p className="text-sm font-serif italic text-muted">Independent and established beauty selected across skin, body and sun.</p>
            <p className="text-[10px] font-bold uppercase tracking-widest">{filteredProducts.length} Products / {new Set(products.map(p => p.brand)).size} Brands</p>
          </div>
        </div>
      </div>

      <div className="sticky top-[73px] z-40 bg-[#F8F6F4] border-b border-border border-t">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-24 flex justify-between items-center h-14">
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest h-full">
            <button 
              onClick={() => setActiveTab('all')} 
              className={`h-full border-b-2 transition-colors ${activeTab === 'all' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-primary'}`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveTab('skin')} 
              className={`h-full border-b-2 transition-colors ${activeTab === 'skin' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-primary'}`}
            >
              Skin
            </button>
            <button 
              onClick={() => setActiveTab('body')} 
              className={`h-full border-b-2 transition-colors ${activeTab === 'body' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-primary'}`}
            >
              Body
            </button>
            <button 
              onClick={() => setActiveTab('sun')} 
              className={`h-full border-b-2 transition-colors ${activeTab === 'sun' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-primary'}`}
            >
              Sun
            </button>
          </div>
          
          <div className="flex text-[10px] font-bold uppercase tracking-widest border-l border-border h-full">
            <button className="flex items-center justify-between gap-2 px-6 h-full border-r border-border hover:bg-black/5 transition-colors min-w-[160px]">
              Best Sellers <ChevronDown className="w-3 h-3" />
            </button>
            <button className="flex items-center justify-between gap-2 px-6 h-full hover:bg-black/5 transition-colors min-w-[120px]">
              Filter +
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#F8F6F4] py-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-16">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

